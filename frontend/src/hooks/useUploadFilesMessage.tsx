import { uploadFilesMessage } from "@/api/uploadApi";
import { useMutation } from "@tanstack/react-query";

export function useUploadFilesMessage() {
  return useMutation({
    mutationFn: uploadFilesMessage,
  });
}
