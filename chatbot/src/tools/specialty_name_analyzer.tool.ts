import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import { tool } from "@langchain/core/tools";

dotenv.config();

const specialtySchema = z.object({
  specialty_name: z
    .string()
    .min(1, "specialty_name is required")
    .describe("Tên chuyên khoa cần được xác định từ văn bản."),
});

type SpecialtyOutput = z.infer<typeof specialtySchema>;

const systemPrompt = `
Bạn là hệ thống trích xuất thông tin tên chuyên khoa từ văn bản tiếng Việt.

Nhiệm vụ:
- Xác định tên chuyên khoa (specialty_name) dựa vào văn bản đầu vào.
- Chuẩn hóa:
  - Tên chuyên khoa: Viết hoa chữ cái đầu tiên của mỗi từ.
`;

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "Phân tích thông tin tên chuyên khoa từ câu sau: {text_input}"],
]);

const model = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const structuredModel = model.withStructuredOutput(specialtySchema);

const pipeline = promptTemplate.pipe(structuredModel);

export const AnalyzeSpecialtyTool = tool(
  async ({ text_input }: { text_input: string }) => {
    const result = await pipeline.invoke({ text_input });
    return result;
  },
  {
    name: "analyze_time",
    description: "Phân tích văn bản để xác định tên chuyên khoa tương ứng.",
    schema: z.object({
      text_input: z
        .string()
        .describe(
          "Câu mô tả chuyên khoa tiếng Việt, ví dụ 'Tôi muốn khám chuyên khoa nhi.'"
        ),
    }),
  }
);

// async function runTests() {
//   const testCases = [
//     "Tôi muốn khám chuyên khoa tim mạch.",
//     "Cho tôi đặt lịch khám khoa nội tổng quát.",
//     "Tôi cần gặp bác sĩ khoa da liễu.",
//     "Khám tai mũi họng giúp tôi.",
//     "Tôi muốn đặt lịch ở chuyên khoa mắt.",
//     "Khám răng hàm mặt vào sáng mai.",
//     "Tôi muốn kiểm tra tổng quát sức khỏe.",
//     "Khám phụ khoa chiều nay.",
//     "Tôi cần đặt lịch khám ở chuyên khoa cơ xương khớp.",
//     "Tôi muốn khám tại khoa nhi cho bé Lan.",
//     "Hẹn bác sĩ bên chuyên khoa xét nghiệm.",
//   ];

//   for (const [index, text_input] of testCases.entries()) {
//     console.log(`🧩 Test ${index + 1}: "${text_input}"`);
//     try {
//       const result = await AnalyzeSpecialtyTool.invoke({ text_input });
//       console.log("✅ Kết quả:", result, "\n");
//     } catch (err) {
//       console.error("❌ Lỗi khi xử lý:", err);
//     }
//   }
// }

// runTests();
