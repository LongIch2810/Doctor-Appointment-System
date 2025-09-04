import type { User } from "@/types/global";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  userInfo: User | null;
  loading: boolean;
  error: string | null;
  setLoading: (val: boolean) => void;
  setUser: (user: User) => void;
  resetState: () => void;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      loading: false,
      error: null,
      setLoading: (val) => set({ loading: val }),
      setUser: (user) => set({ userInfo: user }),
      resetState: () => set({ userInfo: null, loading: false }),
      login: async (usernameOrEmail, password) => {
        set({ loading: true });

        try {
          const res = await axios.post("/api/auth/login", {
            usernameOrEmail,
            password,
          });
          const { user } = res.data;

          set({
            userInfo: user,
            loading: false,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Đăng nhập thất bại",
            loading: false,
          });
        }
      },

      logout: () => {
        set({
          userInfo: null,
          loading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        userInfo: state.userInfo,
      }),
    }
  )
);
