import * as dotenv from "dotenv";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import bookingGraph from "../langgraph/booking.graph.js";

dotenv.config();

export const bookingAppointmentTool = tool(
  async ({ text_input }, runManager) => {
    try {
      const token = runManager?.configurable?.token;
      if (!token)
        return "❌ Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi đặt lịch.";

      const result = await bookingGraph.invoke({ text_input, token });

      console.log("🧩 bookingGraph result:", JSON.stringify(result, null, 2));

      if (!result) return "⚠️ Không thể xử lý yêu cầu đặt lịch.";

      const br = result.booking_result;

      if (br?.status === "pending") return br.message;
      if (br?.status === "need_user_choice") return br.message;
      if (typeof br === "string") return br;

      return "✅ Đặt lịch thành công.";
    } catch (error) {
      console.error("🔥 Lỗi trong bookingAppointmentTool:", error);
      return "❌ Lỗi hệ thống khi đặt lịch. Vui lòng thử lại.";
    }
  },
  {
    name: "booking_appointment_tool",
    description: `
Công cụ này **thực thi hành động đặt lịch khám bệnh** cho người dùng đã đăng nhập.  
Không cần AI tự phân tích thủ công — toàn bộ logic phân tích (bác sĩ, người khám, chuyên khoa, thời gian...) đã được xử lý trong LangGraph.

Khi người dùng nói những câu như:
- "Đặt lịch khám với bác sĩ Tuấn sáng mai cho bé Lan"
- "Muốn khám tim mạch chiều nay"
- "Book lịch với bác sĩ Minh ngày mai"

➡️ Hãy **gọi ngay tool này** để thực hiện việc đặt lịch.
Tool sẽ tự:
1. Phân tích văn bản.
2. Kiểm tra dữ liệu còn thiếu.
3. Nếu đủ thông tin → gửi yêu cầu đặt lịch.
4. Nếu thiếu → trả về danh sách cần bổ sung.

Không cần LLM hỏi lại nếu thông tin đã đầy đủ.`,
    schema: z.object({
      text_input: z
        .string()
        .describe(
          "Câu mô tả yêu cầu đặt lịch, ví dụ: 'Đặt lịch khám cho bé Lan với bác sĩ Tuấn sáng mai lúc 9 giờ'."
        ),
    }),
  }
);
