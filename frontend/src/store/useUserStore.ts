import type { User } from "@/types/interface/user.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  userInfo: User | null;
  setUserInfo: (user: User | null) => void;
  resetState: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (user) => set({ userInfo: user }),
      resetState: () =>
        set({
          userInfo: null,
        }),
    }),
    {
      name: "user-storage", // key trong localStorage
    }
  )
);
