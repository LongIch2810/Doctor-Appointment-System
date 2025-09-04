import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Message = {
  id: number;
  text: string;
  fromUser: boolean;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Xin chào!", fromUser: false },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input.trim(),
      fromUser: true,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      const botReply: Message = {
        id: newUserMessage.id + 1,
        text: `Bạn vừa nói: "${input.trim()}"`,
        fromUser: false,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen p-4 md:p-8 md:mx-20">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
        {messages.map(({ id, text, fromUser }) => (
          <div
            key={id}
            className={`flex items-start gap-3 ${
              fromUser ? "justify-end" : "justify-start"
            }`}
          >
            {!fromUser && (
              <Avatar title="ChatbotMedicalAssistant">
                <AvatarImage
                  src="https://cdn.dribbble.com/userupload/2798814/file/original-3cfdbabadfd8f92aed97b0c0b57c6b89.png?resize=1600x1200&vertical=center"
                  alt="ChatbotMedicalAssistant"
                />
                <AvatarFallback>🤖</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg break-words whitespace-pre-wrap
                ${
                  fromUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-red-200 text-gray-800 rounded-bl-none"
                }`}
            >
              {text}
            </div>
            {fromUser && (
              <Avatar>
                <AvatarFallback>🧑</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSend}>Gửi</Button>
      </div>
    </div>
  );
}
