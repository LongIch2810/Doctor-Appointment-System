import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useUserStore } from "@/store/useUserStore";
import MarkdownMessage from "@/components/message/MarkdownMessage";
import { registerHandler, safeEmit } from "@/utils/socket";
import Loading from "@/components/loading/Loading";
import { useGetMessagesChatbotInfinite } from "@/hooks/useGetMessagesChatbotInfinite";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

type Role = "human" | "ai";

interface Message {
  id: number;
  content: string;
  role: Role;
  isTyping?: boolean;
  startTypingAt?: number;
  elapsed?: number;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { userInfo } = useUserStore();
  const socket = useSocket(userInfo?.id);
  const { data, hasNextPage, fetchNextPage, isFetching } =
    useGetMessagesChatbotInfinite(userInfo!.id);
  const queryClient = useQueryClient();
  const messages: Message[] = useMemo(() => {
    const merged =
      data?.pages
        .slice()
        .reverse()
        .flatMap((page) => page.data.messages) ?? [];
    const uniqueMessages = Array.from(
      new Map(merged.map((m) => [m.id, m])).values()
    );
    return uniqueMessages.length > 0
      ? uniqueMessages
      : [{ id: 1, role: "ai", content: "Chào bạn, bạn cần tư vấn gì?" }];
  }, [data]);
  console.log(">>> data messages with chatbot : ", data);
  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
    }
  }, [userInfo, navigate]);

  // 🧠 Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Scroll tin nhắn cũ hơn mượt mà hơn
  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const top = container.scrollTop;

    if (top <= 5 && hasNextPage && !isFetching) {
      const prevScrollHeight = container.scrollHeight;

      await fetchNextPage();

      // ⚡ Đợi React render xong trước khi set scrollTop
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          messagesContainerRef.current.scrollTop =
            newScrollHeight - prevScrollHeight;
        }
      });
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    requestAnimationFrame(scrollToBottom);
  }, [data]);

  // 🧠 Nhận tin nhắn từ chatbot
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessageChatbot = (data: any) => {
      console.log(">>> data : ", data);

      // ✅ Xóa bubble typing + clear interval
      clearTypingInterval();
      queryClient.setQueryData(
        ["messages-chatbot", userInfo!.id],
        (oldData: any) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              messages: [
                ...page.data.messages.filter((m: any) => !m.isTyping),
                {
                  id: Date.now(),
                  content:
                    typeof data === "string" ? data : JSON.stringify(data),
                  role: "ai",
                },
              ],
            },
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      setIsPending(false);
    };

    registerHandler("receive:message:chatbot", handleReceiveMessageChatbot);
    return () => {
      socket.off("receive:message:chatbot", handleReceiveMessageChatbot);
    };
  }, [socket]);

  // 🕒 Hàm bắt đầu đếm thời gian typing
  const startTypingInterval = (typingId: number) => {
    typingIntervalRef.current = setInterval(() => {
      queryClient.setQueryData(
        ["messages-chatbot", userInfo!.id],
        (oldData: any) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              messages: page.data.messages.map((m: any) =>
                m.id === typingId && m.isTyping
                  ? {
                      ...m,
                      elapsed: Math.floor(
                        (Date.now() - (m.startTypingAt ?? 0)) / 1000
                      ),
                    }
                  : m
              ),
            },
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
    }, 1000);
  };

  // 🛑 Clear interval khi chatbot trả lời
  const clearTypingInterval = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const handleInputContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  // 📤 Gửi tin nhắn user
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: input.trim(),
      role: "human",
    };

    // Bubble typing bot
    const typingId = Date.now() + 1;
    const typingMessage: Message = {
      id: typingId,
      content: "",
      role: "ai",
      isTyping: true,
      startTypingAt: Date.now(),
      elapsed: 0,
    };
    queryClient.setQueryData(
      ["messages-chatbot", userInfo!.id],
      (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          data: {
            ...page.data,
            messages: [...page.data.messages, userMessage, typingMessage],
          },
        }));
        return {
          ...oldData,
          pages: newPages,
        };
      }
    );
    startTypingInterval(typingId);
    setIsPending(true);

    safeEmit("send:message:chatbot", {
      userId: userInfo?.id,
      question: input.trim(),
    });

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-3xl flex flex-col border rounded-xl shadow-xl bg-white h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-2 bg-white rounded-t-xl shadow-sm">
          <img
            src="/logo.jpg"
            alt="YouMed Logo"
            className="size-16 object-cover rounded-full"
          />
          <span className="text-gray-400 mx-2">/</span>
          <h1 className="font-semibold text-gray-800 text-lg flex items-center gap-1">
            Trợ lý y khoa
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-blue-500"
            >
              <path d="M22.5 12c0 5.79-4.71 10.5-10.5 10.5S1.5 17.79 1.5 12 6.21 1.5 12 1.5 22.5 6.21 22.5 12zM10.94 17.25l7.31-7.31-1.06-1.06-6.25 6.25-2.81-2.81-1.06 1.06 3.87 3.87z" />
            </svg>
          </h1>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 p-2 overflow-y-auto space-y-2 bg-muted/20"
        >
          {messages.map(({ id, content, role, isTyping, elapsed }) => (
            <div
              key={id}
              className={`flex items-end gap-3 ${
                role === "human" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar Bot */}
              {role === "ai" && (
                <Avatar className="w-10 h-10 bg-gray-200 border shadow">
                  <AvatarImage src="" alt="Bot" />
                  <AvatarFallback>
                    <Bot className="text-primary" size={18} />
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl break-words text-sm md:text-base shadow-sm
                  ${
                    role === "human"
                      ? "bg-blue-600 text-white rounded-br-none whitespace-pre-wrap"
                      : "bg-gray-200 text-gray-800 rounded-bl-none prose max-w-none"
                  }`}
              >
                {isTyping ? (
                  <div className="flex flex-col">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Đang trả lời... {elapsed}s
                    </span>
                  </div>
                ) : role === "human" ? (
                  content
                ) : (
                  <MarkdownMessage content={content} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white flex gap-3 sticky bottom-0">
          <Input
            value={input}
            onInput={handleInputContent}
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded px-2 py-1 text-xs"
            placeholder="Aa"
          />
          <Button
            disabled={isPending}
            onClick={handleSend}
            className="rounded-full px-6 bg-primary text-white"
          >
            {isPending ? <Loading size={10} /> : "Gửi"}
          </Button>
        </div>
      </div>
    </section>
  );
}
