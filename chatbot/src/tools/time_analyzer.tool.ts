import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import { tool } from "@langchain/core/tools";

dotenv.config();

const dateTimeSchema = z.object({
  appointment_date: z
    .string()
    .min(1, "appointment_date is required")
    .describe("Ngày đặt lịch theo định dạng YYYY-MM-DD. Ví dụ: 2025-08-28"),
  start_time: z
    .string()
    .describe(
      "Thời gian bắt đầu khung giờ mà người dùng rảnh để đi khám. " +
        "Được sử dụng để hệ thống gợi ý các bác sĩ hoặc lịch khám phù hợp trong khoảng thời gian này. " +
        "Định dạng chuẩn HH:mm (giờ theo 24h). " +
        "Ví dụ: '09:00' nghĩa là người dùng rảnh bắt đầu từ 9 giờ sáng."
    ),
  end_time: z
    .string()
    .describe(
      "Thời gian kết thúc khung giờ mà người dùng rảnh để đi khám. " +
        "Hệ thống sẽ chỉ tìm các khung lịch bác sĩ phù hợp nằm trong khoảng từ 'start_time' đến 'end_time'. " +
        "Định dạng chuẩn HH:mm (giờ theo 24h). " +
        "Ví dụ: '11:00' nghĩa là người dùng rảnh đến 11 giờ trưa."
    ),
});

type DateTimeOutput = z.infer<typeof dateTimeSchema>;

const today = new Date();
const currentDate = today.toISOString().split("T")[0];

const systemPrompt = `
Bạn là hệ thống trích xuất thông tin thời gian đặt lịch khám từ văn bản tiếng Việt.

Nhiệm vụ:
- Xác định ngày đặt lịch (appointment_date) dựa vào thời gian ngày hiện tại là ${currentDate},
- Xác định giờ bắt đầu (start_time) và giờ kết thúc (end_time)
- Chuẩn hóa:
  - Ngày: YYYY-MM-DD
  - Giờ: HH:mm
- Nếu không có giờ kết thúc → cộng thêm 30 phút.
- Nếu chỉ nói "sáng", mặc định 08:00 - 12:00
- Nếu chỉ nói "chiều", mặc định 13:00 - 17:00
- Nếu chỉ nói "tối", mặc định 18:00 - 21:00
- Nếu không rõ, để chuỗi rỗng.
`;

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "Văn bản cần phân tích: {text_input}"],
]);

const model = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const structuredModel = model.withStructuredOutput(dateTimeSchema);

const pipeline = promptTemplate.pipe(structuredModel);

export const AnalyzeTimeTool = tool(
  async ({ text_input }: { text_input: string }) => {
    const result = await pipeline.invoke({ text_input });
    return result;
  },
  {
    name: "analyze_time",
    description:
      "Phân tích văn bản để xác định thời gian đặt lịch khám tương ứng.",
    schema: z.object({
      text_input: z
        .string()
        .describe(
          "Câu mô tả thời gian đặt lịch khám tiếng Việt, ví dụ 'Tôi muốn đặt lịch khám vào sáng mai.'"
        ),
    }),
  }
);

// async function runTests() {
//   const testCases = [
//     {
//       text_input:
//         "Tôi muốn đặt lịch khám cho con gái tôi với bác sĩ Lê Văn Minh chuyên khoa nội tổng quát vào sáng ngày mai ?",
//       expected: "Ngày mai, 09:00 - 11:00",
//     },
//   ];

//   console.log("=== 🧠 BẮT ĐẦU CHẠY TEST AnalyzeTimeTool ===\n");

//   for (let i = 0; i < testCases.length; i++) {
//     const { text_input, expected } = testCases[i];
//     console.log(`🧩 Test ${i + 1}: "${text_input}"`);
//     try {
//       const result = await AnalyzeTimeTool.invoke({ text_input });
//       console.log("✅ Kết quả phân tích:", result);
//       console.log(`🎯 Mong đợi: ${expected}\n`);
//     } catch (err) {
//       console.error("❌ Lỗi khi xử lý:", err);
//     }
//   }

//   console.log("=== ✅ HOÀN THÀNH TOÀN BỘ TEST CASE ===");
// }

// runTests();
