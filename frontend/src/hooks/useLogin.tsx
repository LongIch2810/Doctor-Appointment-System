import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "@/api/userApi";
import { useUserStore } from "@/store/useUserStore";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUserInfo = useUserStore((s) => s.setUserInfo);
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      toast.success(data.data.message);
      const query = await queryClient.fetchQuery({
        queryKey: ["profile"],
        queryFn: fetchUserInfo,
      });
      setUserInfo(query.data);
      navigate("/");
    },
    onError: () => {
      toast.error("Đăng nhập thất bại!");
    },
  });
}
