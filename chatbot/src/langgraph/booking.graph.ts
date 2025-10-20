import * as dotenv from "dotenv";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { AnalyzeDoctorTool } from "../tools/doctor_name_analyzer.tool.js";
import { AnalyzeRelativeTool } from "../tools/relative_analyzer.tool.js";
import { AnalyzeSpecialtyTool } from "../tools/specialty_name_analyzer.tool.js";
import { AnalyzeTimeTool } from "../tools/time_analyzer.tool.js";
import { DynamicStructuredTool } from "@langchain/core/tools";
import axios from "axios";

dotenv.config();

const mergedAnnotations = (oldObj: any, newObj: any) => ({
  ...oldObj,
  ...newObj,
});

const BookingState = Annotation.Root({
  text_input: Annotation<string>(),
  token: Annotation<string>(),

  doctor: Annotation<{ doctor_name: string }>({ reducer: mergedAnnotations }),

  specialty: Annotation<{ specialty_name: string }>({
    reducer: mergedAnnotations,
  }),

  time: Annotation<{
    appointment_date: string;
    start_time: string;
    end_time: string;
  }>({ reducer: mergedAnnotations }),

  relatives: Annotation<
    { id: number; fullname: string; dob: string; gender: string }[]
  >({
    reducer: (oldArr, newArr) => {
      const merged = [...(oldArr || []), ...(newArr || [])];
      const unique = Array.from(
        new Map(merged.map((item) => [item.id, item])).values()
      );
      return unique;
    },
  }),

  selected_relative_id: Annotation<number | null>({
    reducer: (_o, n) => n,
  }),

  ready: Annotation<boolean>({ reducer: (_o, n) => n }),

  missing: Annotation<string[]>({
    reducer: (a = [], b = []) =>
      Array.from(new Set([...(a || []), ...(b || [])])),
  }),

  booking_result: Annotation<any>({ reducer: (_o, n) => n }),
});

async function runTool<T extends DynamicStructuredTool>(
  tool: T,
  args: Record<string, any>
) {
  const result = await tool.invoke(args);
  return result;
}

// 🧩 Node: Phân tích người thân
async function analyzeRelativeNode(state: typeof BookingState.State) {
  console.log("\n🧩 [Node] analyze_relative — input:", state.text_input);

  const res = await runTool(AnalyzeRelativeTool as DynamicStructuredTool, {
    text_input: state.text_input,
    token: state.token,
  });

  console.log("✅ [Node] analyze_relative — output:", res);

  const relatives = res?.relatives || [];
  let selected_relative_id: number | null = null;

  if (relatives.length === 1) {
    selected_relative_id = relatives[0].id;
  }

  return { relatives, selected_relative_id };
}

// 🧩 Node: Phân tích bác sĩ
async function analyzeDoctorNode(state: typeof BookingState.State) {
  console.log("\n🧩 [Node] analyze_doctor — input:", state.text_input);
  const res = await runTool(AnalyzeDoctorTool as DynamicStructuredTool, {
    text_input: state.text_input,
  });
  console.log("✅ [Node] analyze_doctor — output:", res);
  return { doctor: res };
}

// 🧩 Node: Phân tích chuyên khoa
async function analyzeSpecialtyNode(state: typeof BookingState.State) {
  console.log("\n🧩 [Node] analyze_specialty — input:", state.text_input);
  const res = await runTool(AnalyzeSpecialtyTool as DynamicStructuredTool, {
    text_input: state.text_input,
  });
  console.log("✅ [Node] analyze_specialty — output:", res);
  return { specialty: res };
}

// 🧩 Node: Phân tích thời gian
async function analyzeTimeNode(state: typeof BookingState.State) {
  console.log("\n🧩 [Node] analyze_time — input:", state.text_input);
  const res = await runTool(AnalyzeTimeTool as DynamicStructuredTool, {
    text_input: state.text_input,
  });
  console.log("✅ [Node] analyze_time — output:", res);
  return { time: res };
}

// 🧩 Node: Kiểm tra điều kiện đầy đủ
function checkerNode(state: typeof BookingState.State) {
  console.log(
    "\n🧩 [Node] checker — state hiện tại:",
    JSON.stringify(state, null, 2)
  );

  const missing: string[] = [];

  if (!state.selected_relative_id) missing.push("selected_relative_id");
  if (!state.specialty?.specialty_name) missing.push("specialty");
  if (!state.doctor?.doctor_name) missing.push("doctor");
  if (!state.time?.appointment_date) missing.push("appointment_date");
  if (!state.time?.start_time) missing.push("start_time");
  if (!state.time?.end_time) missing.push("end_time");

  const ready = missing.length === 0;
  console.log(
    "✅ [Node] checker — missing:",
    missing.length ? missing.join(", ") : "Không thiếu gì"
  );

  return { missing, ready };
}

// 🧩 Node: Gửi yêu cầu đặt lịch
async function bookingAppointmentNode(state: typeof BookingState.State) {
  console.log(
    "\n🧩 [Node] booking_appointment — state:",
    JSON.stringify(state, null, 2)
  );

  const payload = {
    relative_id: state.selected_relative_id,
    specialty_name: state.specialty?.specialty_name,
    doctor_name: state.doctor?.doctor_name,
    appointment_date: state.time?.appointment_date,
    start_time: state.time?.start_time,
    end_time: state.time?.end_time,
    booking_mode: "ai_select",
  };

  console.log("📦 [booking_appointment] Payload gửi API:", payload);

  try {
    const token = state?.token;

    if (!token) {
      console.log("❌ [booking_appointment] Thiếu token, không thể đặt lịch");
      return "Lỗi: Người dùng chưa đăng nhập. Không thể đặt lịch.";
    }

    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/appointments/booking-appointment`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { jobId } = response.data?.data;

    console.log("✅ [booking_appointment] API thành công, jobId:", jobId);

    return {
      status: "pending",
      jobId,
      message: `Hệ thống đang xử lý yêu cầu đặt lịch (#${jobId})...`,
    };
  } catch (error) {
    console.error("💥 [booking_appointment] Lỗi:", error);
    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error?.details ||
        "Không rõ lỗi từ phía server.";
      return `Lỗi từ API khi đặt lịch: ${errMsg}`;
    }
    return "Lỗi không xác định khi đặt lịch. Vui lòng thử lại sau.";
  }
}

const workflow = new StateGraph(BookingState)
  .addNode("analyze_relative", analyzeRelativeNode)
  .addNode("analyze_doctor", analyzeDoctorNode)
  .addNode("analyze_specialty", analyzeSpecialtyNode)
  .addNode("analyze_time", analyzeTimeNode)
  .addNode("checker", checkerNode)
  .addNode("booking_appointment", bookingAppointmentNode)
  .addEdge("__start__", "analyze_relative")
  .addEdge("__start__", "analyze_doctor")
  .addEdge("__start__", "analyze_specialty")
  .addEdge("__start__", "analyze_time")
  .addEdge("analyze_relative", "checker")
  .addEdge("analyze_doctor", "checker")
  .addEdge("analyze_specialty", "checker")
  .addEdge("analyze_time", "checker")
  .addConditionalEdges("checker", (state) => {
    return state.ready ? "booking_appointment" : "__end__";
  })
  .addEdge("booking_appointment", "__end__");

const bookingGraph = workflow.compile();

export default bookingGraph;

// async function runTests(text_input: string, token: string) {
//   const result = await bookingGraph.invoke({
//     text_input,
//     token,
//   });

//   console.log(">>> KET QUA: ", result);
// }

// runTests(
//   "Tôi muốn đặt lịch khám cho con trai tôi với bác sĩ Lê Văn Minh chuyên khoa nội tổng quát vào sáng ngày mai ?",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM1LCJyb2xlcyI6W10sInRva2VuSWQiOiI0ZDk1NzE3NC1kYjlhLTQ4Y2ItOGQwYy1lYWIzMTA0ODM4ZTkiLCJzZXNzaW9uVmVyc2lvbiI6MSwiaWF0IjoxNzYwOTAxMzg5LCJleHAiOjE3NjA5MDIyODl9.5WOqSh7igp9VICYkLYuIt4Hc4VCg1Udz409I0RkOhs8"
// );
