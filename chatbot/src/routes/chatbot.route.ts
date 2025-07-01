import express from "express";
import { handleChatController } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/chat", handleChatController);

export default router;
