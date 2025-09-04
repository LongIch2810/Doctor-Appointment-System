import * as dotenv from "dotenv";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ragTool } from "../tools/rag.tool.js";
import { qaSqlTool } from "../tools/qa_sql.tool.js";
import { medicalConsultationTool } from "../tools/medical_consultation.tool.js";
import { bookingAppointmentTool } from "../tools/booking_appointment.tool.js";
import { cancelAppointmentTool } from "../tools/cancel_appointment.tool.js";
import { restoreAppointmentTool } from "../tools/restore_appointment.tool.js";
import { getHealthProfileTool } from "../tools/get_health_profile.tool.js";
import { updateHealthProfileTool } from "../tools/update_health_profile.tool.js";

dotenv.config();

const tools = [
  ragTool,
  qaSqlTool,
  medicalConsultationTool,
  bookingAppointmentTool,
  cancelAppointmentTool,
  restoreAppointmentTool,
  getHealthProfileTool,
  updateHealthProfileTool,
];
const toolNode = new ToolNode(tools);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
}).bindTools(tools);

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);

  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

const agent = workflow.compile();

export default agent;
