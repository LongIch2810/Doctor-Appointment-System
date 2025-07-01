import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
export default async function loadDocuments(
  filePaths: string[]
): Promise<Document[]> {
  const documents = await Promise.all(
    filePaths.map(async (filePath) => {
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();
      return docs;
    })
  );
  return documents.flat();
}
