import { tool } from "@langchain/core/tools";
import { z } from "zod";
import setupQASql from "../qa_sql/qa_sql.js";

export const qaSqlTool = tool(
  async ({ question }) => {
    const qaSqlGraph = await setupQASql();
    const finalState = await qaSqlGraph.invoke({ question });
    return finalState.answer;
  },
  {
    name: "qa_sql_tool",
    description: `
Use this tool to answer factual questions by directly querying a PostgreSQL medical database. 
It is suitable for questions that require structured information such as:

- The number of doctors, articles, or specialties.
- Lists of doctors, specialties, or medical articles.
- Doctor-related details like experience, workplace, or specialization.
- Any other query that can be answered using structured tabular data.

Do **not** use this tool for general knowledge, advice, or opinion-based questions.

The tool automatically generates SQL queries from the user's question, runs them on the database, and summarizes the result.

📌 Return the answer in **HTML format using Tailwind CSS** — this HTML will be rendered in the UI. Use simple responsive card or table layouts with Tailwind classes for formatting.

📌 The response must remain in the **same language** as the user's question (e.g., English, Vietnamese).
    `,
    schema: z.object({
      question: z.string(),
    }),
  }
);
