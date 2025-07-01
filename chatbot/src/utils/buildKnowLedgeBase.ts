import loadDocuments from "./loadDocuments.js";
import splitDocuments from "./splitDocuments.js";
import { FILE_PATHS } from "./constants.js";
import initVectorDB from "../configs/vectordb.js";

export const buildKnowLedgeBase = async () => {
  const documents = await loadDocuments(FILE_PATHS);

  const texts = await splitDocuments(documents);

  await initVectorDB(texts);
};
