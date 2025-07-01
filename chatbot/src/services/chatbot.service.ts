import { AIMessage } from "@langchain/core/messages";
import agent from "../agents/agents.js";
import { ChatInput } from "../types/ChatInput.js";

const handleChatService = async ({ question }: ChatInput) => {
  try {
    const result = await agent.invoke({ messages: [question] });
    const reply = result.messages[result.messages.length - 1] as AIMessage;
    console.log(reply.content);
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
