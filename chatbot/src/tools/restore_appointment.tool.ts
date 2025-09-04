import * as dotenv from "dotenv";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

dotenv.config();

export const restoreAppointmentTool = tool(
  async (
    { appointment_date, start_time, end_time, doctor_name, specialty_name },
    runManager
  ) => {
    try {
      const token = runManager?.configurable?.token;

      if (!token) {
        return "Lỗi: Người dùng chưa đăng nhập. Không thể khôi phục lịch hẹn.";
      }

      const response = await axios.post(
        `${process.env.BACKEND_URL}/api/v1/appointments/restore-appointment`,
        {
          appointment_date,
          start_time,
          end_time,
          doctor_name,
          specialty_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const restoredAppointments = response.data?.data;
      const message =
        response.data?.message || "Khôi phục lịch hẹn thành công.";

      if (!restoredAppointments || restoredAppointments.length === 0) {
        return `Không tìm thấy hoặc không thể khôi phục lịch hẹn.\nPhản hồi từ hệ thống: ${message}`;
      }

      return `Đã khôi phục thành công ${
        restoredAppointments.length
      } lịch hẹn:\nNgày: ${appointment_date}\nThời gian: ${start_time} - ${end_time}\nBác sĩ: ${
        doctor_name || "Không rõ"
      }\nChuyên khoa: ${specialty_name || "Không rõ"}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg =
          error.response?.data?.message ||
          error.response?.data?.error?.details ||
          "Không rõ lỗi từ phía server.";
        return `Lỗi khi khôi phục lịch hẹn: ${errMsg}`;
      }
      console.error("Generic Error on restore:", error);
      return "Lỗi không xác định khi khôi phục lịch hẹn. Vui lòng thử lại sau.";
    }
  },
  {
    name: "restore_appointment_tool",
    description: `
Dùng công cụ này để khôi phục lịch hẹn khám bệnh đã bị hủy cho người dùng đã xác thực.
Bạn có thể khôi phục bằng cách cung cấp:
- appointment_date: Ngày đặt lịch (YYYY-MM-DD)
- start_time: Thời gian bắt đầu, định dạng HH:mm (24h).
- end_time: Thời gian kết thúc, định dạng HH:mm (24h).
- doctor_name: Tên đầy đủ bác sĩ
- specialty_name: Tên chuyên khoa

Nếu hệ thống tìm thấy lịch hẹn phù hợp, sẽ tiến hành khôi phục và xác nhận lại cho bạn.
`,
    schema: z.object({
      appointment_date: z
        .string()
        .describe("Ngày đặt lịch theo định dạng YYYY-MM-DD. Ví dụ: 2025-08-28"),
      start_time: z
        .string()
        .describe("Thời gian bắt đầu, định dạng HH:mm. Ví dụ: 14:30"),
      end_time: z
        .string()
        .describe("Thời gian kết thúc, định dạng HH:mm. Ví dụ: 15:00"),
      doctor_name: z.string().describe("Tên đầy đủ của bác sĩ."),
      specialty_name: z.string().describe("Tên chuyên khoa."),
    }),
  }
);
