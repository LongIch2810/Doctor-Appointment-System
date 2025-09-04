import * as dotenv from "dotenv";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

dotenv.config();

export const bookingAppointmentTool = tool(
  async (
    { appointment_date, start_time, end_time, doctor_name, specialty_name },
    runManager
  ) => {
    try {
      const token = runManager?.configurable?.token;

      if (!token) {
        return "Lỗi: Người dùng chưa đăng nhập. Không thể đặt lịch.";
      }

      const response = await axios.post(
        `${process.env.BACKEND_URL}/api/v1/appointments/booking-appointment`,
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

      const appointment = response.data?.data;
      const message = response.data?.message;

      if (!appointment) {
        return `Lịch hẹn đã được đặt, nhưng không có thông tin chi tiết.\nHệ thống phản hồi: ${
          message || "Không rõ lý do."
        }`;
      }

      return `Đặt lịch thành công!\n\nNgày: ${
        appointment.appointment_date
      }\nThời gian: ${appointment.start_time} - ${
        appointment.end_time
      }\nBác sĩ: ${appointment.doctor_name}\nChuyên khoa: ${
        appointment.specialty_name
      }\nTrạng thái: ${appointment.status || "Đang chờ xử lý"}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg =
          error.response?.data?.message ||
          error.response?.data?.error?.details ||
          "Không rõ lỗi từ phía server.";
        return `Lỗi từ API khi đặt lịch: ${errMsg}`;
      }
      console.error("Generic Error on booking:", error);
      return "Lỗi không xác định khi đặt lịch. Vui lòng thử lại sau.";
    }
  },
  {
    name: "booking_appointment_tool",
    description: `
Dùng công cụ này để đặt lịch hẹn khám bệnh cho người dùng đã xác thực.
Trường bắt buộc:
- appointment_date: Định dạng YYYY-MM-DD.
- start_time: Thời gian bắt đầu, định dạng HH:mm (24h).
- end_time: Thời gian kết thúc, định dạng HH:mm (24h).
- doctor_name: Tên đầy đủ của bác sĩ mong muốn.
- specialty_name: Tên chuyên khoa cần khám.

Trả về xác nhận chi tiết lịch hẹn hoặc thông báo lỗi rõ ràng.
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
