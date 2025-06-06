import type { LineProps } from "@/types/global";
import clsx from "clsx";

const Line = ({
  color = "bg-gray-300",
  thickness = "h-[2px]",
  width = "w-full",
  align = "center",
  className = "",
}: LineProps) => {
  const alignment = {
    left: "ml-0",
    center: "mx-auto",
    right: "mr-0 ml-auto",
  };

  return (
    <div
      className={clsx(
        color,
        thickness, //độ dày
        width, //chiều dài
        alignment[align],
        className
      )}
    />
  );
};

export default Line;
