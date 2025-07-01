import * as dotenv from "dotenv";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ragTool } from "../tools/rag.tool.js";
import { qaSqlTool } from "../tools/qa_sql.tool.js";
import { medicalConsultationTool } from "../tools/medical_consultation.tool.js";

dotenv.config();

const tools = [ragTool, qaSqlTool, medicalConsultationTool];
const toolNode = new ToolNode(tools);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
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

let chatHistory: (AIMessage | HumanMessage)[] = [];

const answers = async () => {
  chatHistory.push(
    new HumanMessage("Who is the President of the United States?")
  );
  const result1 = await agent.invoke({ messages: chatHistory });
  const reply1 = result1.messages[result1.messages.length - 1] as AIMessage;
  console.log(reply1.content);
  chatHistory.push(reply1);

  chatHistory.push(new HumanMessage("How old is he?"));
  const result2 = await agent.invoke({ messages: chatHistory });
  const reply2 = result2.messages[result2.messages.length - 1] as AIMessage;
  console.log(reply2.content);
  chatHistory.push(reply2);
};

export default agent;

export { answers };
