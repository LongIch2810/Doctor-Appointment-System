import { tool } from "@langchain/core/tools";
import { z } from "zod";
import setupRagGraph from "../rag/rag.js";

export const ragTool = tool(
  async ({ question }) => {
    const ragGraph = await setupRagGraph();
    const result = await ragGraph.invoke({ question });
    return result.answer;
  },

  {
    name: "rag_tool",
    description: `
Use this tool to answer user questions related to clinic operations, including internal regulations, procedures, and available medical services. 
It retrieves and summarizes relevant information from internal documents stored in a vector database using Retrieval-Augmented Generation (RAG).

This tool is ideal for:
- Answering questions about clinic policies or service guidelines.
- Providing details from onboarding materials or internal documentation.
- Clarifying procedures, roles, or rules defined within the organization.

Do **not** use this tool for general knowledge, database statistics, or structured data queries — use the appropriate SQL tool instead in those cases.

📌 The response will be automatically generated in the **same language** as the user's question (e.g., English, Vietnamese, etc.), ensuring consistent and natural communication.
`,
    schema: z.object({
      question: z
        .string()
        .describe("Câu hỏi của người dùng về dịch vụ y tế hoặc nội quy."),
    }),
  }
);
