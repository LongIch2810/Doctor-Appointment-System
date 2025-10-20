import { Minus, Paperclip, Send, Video, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useGetMessagesInfinite } from "@/hooks/useGetMessagesInfinite";
import { useUserStore } from "@/store/useUserStore";
import { useChannelStore, type Channel } from "@/store/useChannelStore";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import { MessageType } from "@/utils/constants";
import { useUploadFilesMessage } from "@/hooks/useUploadFilesMessage";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { registerHandler, safeEmit } from "@/utils/socket";
interface ChatBoxProps {
  channel: Channel;
  title: string;
  avatar?: string;
  icon?: React.ReactNode;
}
export function ChatBox({ channel, title, icon, avatar }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const { userInfo } = useUserStore();
  const { setChannels, setChatBoxChannels } = useChannelStore();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    useGetMessagesInfinite(channel?.channel_id);
  const { mutate, isPending, isError, error } = useUploadFilesMessage();

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError]);

  useEffect(() => {
    requestAnimationFrame(scrollToBottom);
  }, [data]);

  useEffect(() => {
    if (!isLoading && messagesContainerRef.current) {
      // Lần đầu load => scroll xuống cuối

      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [isLoading, channel?.channel_id]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const socket = useSocket(userInfo?.id);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data: any) => {
      console.log(">>> receiveMessage data : ", data);
      queryClient.setQueryData(
        ["messages", channel.channel_id],
        (oldData: any) => {
          if (!oldData) return oldData;

          const exists = oldData.pages.some((page: any) =>
            page.data.messages.some((m: any) => m.id === data.id)
          );

          if (exists) return oldData;

          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            data: {
              ...newPages[0].data,
              messages: [...newPages[0].data.messages, data],
            },
          };
          return { ...oldData, pages: newPages };
        }
      );
      if (uploadingFiles.length > 0 && data?.id) {
        const formData = new FormData();
        formData.append("message_id", data.id.toString());
        uploadingFiles.forEach((file) => {
          formData.append("files", file);
        });
        mutate(formData);
      }
    };

    const handleUpdateFiles = (data: any) => {
      console.log(">>> newMessage with attachments : ", data);
      queryClient.setQueryData(
        ["messages", channel.channel_id],
        (oldData: any) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              messages: page.data.messages.map((msg: any) =>
                msg.id === data.id ? { ...msg, ...data } : msg
              ),
            },
          }));

          return { ...oldData, pages: newPages };
        }
      );
      setUploadingFiles([]);
    };
    safeEmit("channel:join", { channel_id: channel.channel_id });

    registerHandler("receive:message", handleReceiveMessage);

    registerHandler("updated:message:files", handleUpdateFiles);

    return () => {
      socket?.off("receive:message", handleReceiveMessage);

      socket?.off("updated:message:files", handleUpdateFiles);
    };
  }, [uploadingFiles]);

  const handleInputContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleSend = () => {
    safeEmit("send:message", {
      sender_id: userInfo?.id,
      channel_id: channel.channel_id,
      content: input.trim(),
      message_type: MessageType.Regular,
    });
    console.log(">>>send: ", input);
    setUploadingFiles(selectedFiles);
    setSelectedFiles([]);
    setInput("");
  };

  const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  //Mở chọn dialog chọn file
  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  //Khi chọn file
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = selectedFiles.length + files.length;

    if (totalFiles > 4) {
      toast.error("Chỉ được chọn tối đa 4 ảnh để gửi !");
    } else {
      setSelectedFiles((prev) => [...prev, ...files]);
    }

    e.target.value = "";
  };

  //Xóa file đã chọn
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //Thu nhỏ chatbox thành avatar
  const handleResize = (cb: Channel) => {
    setChannels((prev) => [...prev, cb]);
    setChatBoxChannels((prev) =>
      prev.filter((pr) => pr.channel_id !== cb.channel_id)
    );
  };

  //CLose chatbox
  const handleRemove = (cb: Channel) => {
    setChatBoxChannels((prev) =>
      prev.filter((pr) => pr.channel_id !== cb.channel_id)
    );
  };

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

  //Danh sách tin nhắn
  const messages = useMemo(() => {
    const merged =
      data?.pages
        .slice()
        .reverse()
        .flatMap((page) => page.data.messages) ?? [];

    // ✅ Loại bỏ trùng id để tránh lỗi key trùng khi cuộn lên
    const uniqueMessages = Array.from(
      new Map(merged.map((m) => [m.id, m])).values()
    );

    return uniqueMessages.length > 0
      ? uniqueMessages
      : [{ id: 1, sender: { id: 0 }, content: "Chào bạn, bạn cần tư vấn gì?" }];
  }, [data]);

  console.log(">>> data : ", data);
  console.log(">>> messages : ", messages);

  return (
    <div className="w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b bg-primary/10">
        <div className="flex items-center gap-2">
          {icon ? (
            <div className="w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          ) : avatar ? (
            <Avatar className="w-8 h-8">
              <AvatarImage src={avatar} />
              <AvatarFallback>{title?.[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="w-8 h-8">
              <AvatarFallback>{title?.[0]}</AvatarFallback>
            </Avatar>
          )}

          <span className="font-semibold text-sm">{title || "AI ASSIST."}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => {}}
            className="hover:bg-gray-200"
          >
            <Video size={16} />
          </Button>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => handleResize(channel)}
            className="hover:bg-gray-200"
          >
            <Minus size={16} />
          </Button>

          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => handleRemove(channel)}
            className="hover:bg-red-500 hover:text-white transition-all"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-2 overflow-y-auto space-y-2 bg-muted/20"
      >
        {messages?.length > 0 &&
          messages.map((msg: any) => {
            const isMe = msg.sender?.id === userInfo?.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {/* Ảnh đính kèm - nằm ngoài bubble */}
                {msg.message_attachments?.length > 0 && (
                  <div
                    className={`grid grid-cols-1 gap-1 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isPending &&
                      msg.message_attachments.map((att: any, i: number) => (
                        <div
                          key={i}
                          className="relative w-32 h-32 rounded overflow-hidden"
                        >
                          <img
                            src={att.url}
                            alt={`attachment-${i}`}
                            className="w-full h-full object-cover rounded cursor-pointer"
                            onClick={() => window.open(att.url, "_blank")}
                          />
                        </div>
                      ))}
                    {/* Skeleton khi đang upload ảnh */}
                    {isPending && uploadingFiles.length > 0 && (
                      <div className="flex flex-col items-end gap-1">
                        <div className="grid grid-cols-1 gap-1 justify-end">
                          {uploadingFiles.map((_, idx) => (
                            <Skeleton
                              key={idx}
                              className="w-32 h-32 rounded bg-gray-300 animate-pulse"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Nội dung tin nhắn - bubble riêng */}
                {msg.content && (
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] break-words whitespace-pre-wrap ${
                      isMe
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Preview ảnh đã chọn */}
      {selectedFiles.length > 0 && (
        <div className="p-2 border-t bg-gray-50 flex flex-wrap gap-2">
          <AnimatePresence>
            {selectedFiles.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <motion.div
                  key={file.name + index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-16 h-16 rounded"
                >
                  <img
                    src={previewUrl}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    size={"mini"}
                    variant={"secondary"}
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white hover:bg-red-600 shadow"
                  >
                    <X size={4} />
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      {/* Input */}
      <div className="p-2 border-t flex items-center gap-2">
        <Input
          value={input}
          onInput={handleInputContent}
          onKeyDown={handleKeyEnter}
          className="flex-1 border rounded px-2 py-1 text-xs"
          placeholder="Aa"
        />
        <div>
          <Button onClick={handleOpenFileDialog} size={"sm"}>
            <Paperclip size={16} />
          </Button>
          <Input
            onChange={handleChangeFile}
            ref={fileInputRef}
            multiple
            type="file"
            className="hidden"
          ></Input>
        </div>
        <Button size={"sm"} onClick={handleSend}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
