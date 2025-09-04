import * as dotenv from "dotenv";
dotenv.config();
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import agent from "../agents/agents.js";
import { ChatInput } from "../types/ChatInput.js";
import axios from "axios";

const handleChatService = async ({ question, userId, token }: ChatInput) => {
  try {
    await axios.post(
      `${process.env.BACKEND_URL}/api/v1/chat-history`,
      {
        userId,
        role: "human",
        content: question,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data: history } = await axios.get(
      `${process.env.BACKEND_URL}/api/v1/chat-history/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const chatHistory = history.data.map((item: any) =>
      item.role === "human"
        ? new HumanMessage(item.content)
        : new AIMessage(item.content)
    );

    const result = await agent.invoke(
      { messages: chatHistory },
      {
        configurable: {
          token,
        },
      }
    );

    const reply = result.messages[result.messages.length - 1] as AIMessage;

    await axios.post(
      `${process.env.BACKEND_URL}/api/v1/chat-history`,
      {
        userId,
        role: "ai",
        content: reply.content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      SC: 200,
      answer: reply.content,
    };
  } catch (error) {
    const err = error as Error;
    return {
      SC: 500,
      err: err.message,
    };
  }
};

export { handleChatService };
