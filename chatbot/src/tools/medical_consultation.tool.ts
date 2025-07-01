import * as dotenv from "dotenv";

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const medicalLLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

export const medicalConsultationTool = tool(
  async ({ question }) => {
    const res = await medicalLLM.invoke(question);
    return res.content;
  },
  {
    name: "medical_consultation_tool",
    description: `
Use this tool to provide general medical and healthcare-related guidance. It is designed to generate informative responses based on public medical knowledge, covering topics such as:

- Common symptoms and possible conditions
- Over-the-counter or prescription medications
- Health tips, wellness, and self-care advice
- Explanations of medical terminology or procedures

⚠️ This tool is intended for informational purposes only and does **not** replace professional medical advice, diagnosis, or treatment. It does **not** access internal clinic databases or documents. For structured data (e.g., number of doctors) or internal policies, use the appropriate SQL or RAG tool.

📌 The response will be automatically generated in the **same language** as the user's question (e.g., English, Vietnamese, etc.) to ensure clarity and natural understanding.

👉 Whenever the issue may be serious or unclear, the response should **always recommend the user consult a qualified medical professional or visit a doctor for proper diagnosis and treatment.**
`,
    schema: z.object({
      question: z.string(),
    }),
  }
);
