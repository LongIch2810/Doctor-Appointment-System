import { Request, Response } from "express";
import { ChatInput } from "../types/ChatInput.js";
import { handleChatService } from "../services/chatbot.service.js";

const handleChatController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { question }: ChatInput = req.body;
  if (!question) {
    return res
      .status(400)
      .json({ success: false, message: "Question is required." });
  }
  const result = await handleChatService({ question });
  return result.SC === 200 && result?.answer
    ? res.status(200).json({ success: true, answer: result.answer })
    : res.status(result.SC).json({ success: false, err: result.err });
};

export { handleChatController };
