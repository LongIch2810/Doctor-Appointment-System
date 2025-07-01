import express from "express";
import chatRouter from "./routes/chatbot.route.js";
import { buildKnowLedgeBase } from "./utils/buildKnowLedgeBase.js";
import { AppDatasource } from "./database/data-source.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/chatbot", chatRouter);

app.listen(PORT, async () => {
  await buildKnowLedgeBase();
  console.log(`Server is running at http://localhost:${PORT}`);
});
