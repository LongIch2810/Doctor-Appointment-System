import type { FilterItemProps } from "@/types/global";
import clsx from "clsx";

const FilterItem = ({ label, className = "", icon }: FilterItemProps) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-sm cursor-pointer hover:bg-gray-300 transition whitespace-nowrap",
        "text-gray-800",
        className
      )}
    >
      {icon && <span className="text-black">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export default FilterItem;
