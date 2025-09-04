import * as dotenv from "dotenv";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

dotenv.config();

export const getHealthProfileTool = tool(
  async (_, runManager) => {
    try {
      const token = runManager?.configurable?.token;

      if (!token) {
        return "Lỗi: Người dùng chưa đăng nhập. Không thể lấy hồ sơ sức khỏe của bạn.";
      }

      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/v1/health-profiles/info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const healthProfile = response.data?.data;
      return `**Hồ sơ sức khỏe cá nhân**

Cân nặng: ${healthProfile.weight} kg  
Chiều cao: ${healthProfile.height} cm  
Nhóm máu: ${healthProfile.blood_type}  
Bệnh nền: ${healthProfile.medical_history}  
Dị ứng: ${healthProfile.allergies}  
Nhịp tim: ${healthProfile.heart_rate} bpm  
Huyết áp: ${healthProfile.blood_pressure}  
Đường huyết: ${healthProfile.glucose_level} mg/dL  
Cholesterol: ${healthProfile.cholesterol_level} mg/dL  
Thuốc đang dùng: ${healthProfile.medications || "Không có"}  
Vaccines: ${healthProfile.vaccinations}  
Hút thuốc: ${healthProfile.smoking ? "Có" : "Không"}  
Uống rượu: ${healthProfile.alcohol_consumption ? "Có" : "Không"}  
Tần suất vận động: ${healthProfile.exercise_frequency}  
Ngày khám gần nhất: ${healthProfile.last_checkup_date}
`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message || "Không thể lấy hồ sơ.";
        return `Lỗi từ API khi lấy hồ sơ sức khỏe: ${errMsg}`;
      }
      return "Lỗi không xác định khi lấy hồ sơ sức khỏe.";
    }
  },
  {
    name: "get_health_profile_tool",
    description: `Dùng công cụ này để lấy thông tin hồ sơ sức khỏe của người dùng đã đăng nhập.
Không cần truyền vào tham số nào.
Trả về thông tin chi tiết về tình trạng sức khỏe.`,
    schema: z.object({}),
  }
);
