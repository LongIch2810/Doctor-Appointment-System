import * as dotenv from "dotenv";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

dotenv.config();

export const updateHealthProfileTool = tool(
  async (fields, runManager) => {
    try {
      const token = runManager?.configurable?.token;

      if (!token) {
        return "Lỗi: Người dùng chưa đăng nhập. Không thể cập nhật hồ sơ.";
      }

      const response = await axios.patch(
        `${process.env.BACKEND_URL}/api/v1/health-profiles/update-health-profile`,
        fields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return `${response.data?.data || "Cập nhật hồ sơ thành công."}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg =
          error.response?.data?.message || "Không thể cập nhật hồ sơ.";
        return `Lỗi từ API khi cập nhật hồ sơ: ${errMsg}`;
      }
      return "Lỗi không xác định khi cập nhật hồ sơ.";
    }
  },
  {
    name: "update_health_profile_tool",
    description: `
Dùng công cụ này để cập nhật hồ sơ sức khỏe của người dùng đã đăng nhập.
Chỉ cần truyền các trường cần cập nhật, không bắt buộc đầy đủ.`,
    schema: z.object({
      weight: z.number().optional().describe("Cân nặng (kg)"),
      height: z.number().optional().describe("Chiều cao (cm)"),
      blood_type: z.string().optional().describe("Nhóm máu"),
      medical_history: z.string().optional().describe("Bệnh nền"),
      allergies: z.string().optional().describe("Dị ứng"),
      heart_rate: z.number().optional().describe("Nhịp tim (bpm)"),
      blood_pressure: z.string().optional().describe("Huyết áp"),
      glucose_level: z
        .number()
        .optional()
        .describe("Lượng đường huyết (mg/dL)"),
      cholesterol_level: z
        .number()
        .optional()
        .describe("Mức cholesterol (mg/dL)"),
      medications: z.string().optional().describe("Thuốc đang sử dụng"),
      vaccinations: z.string().optional().describe("Các mũi vac xin đã tiêm"),
      smoking: z.boolean().optional().describe("Có hút thuốc không"),
      alcohol_consumption: z
        .boolean()
        .optional()
        .describe("Có uống rượu không"),
      exercise_frequency: z.string().optional().describe("Tần suất vận động"),
      last_checkup_date: z
        .string()
        .optional()
        .describe("Ngày khám gần nhất (YYYY-MM-DD)"),
    }),
  }
);
