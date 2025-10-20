import { useState } from "react";
export const useShow = (initialState: boolean = false) => {
  const [isShow, setIsShow] = useState(initialState);
  const toggleShow = () => setIsShow((prev) => !prev);
  return { isShow, toggleShow, setIsShow };
};
