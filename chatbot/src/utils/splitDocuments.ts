import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
export default async function splitDocuments(
  documents: Document[]
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 30,
  });

  const texts = await splitter.splitDocuments(documents);
  return texts;
}
