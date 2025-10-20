import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  onClickIcon?: () => void;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, onClickIcon, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {/* wrapper input + icon */}
        <div className="relative w-full">
          <input
            type={type}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              error ? "border-red-500" : "border-gray-300",
              icon ? "pr-10" : "",
              className
            )}
            ref={ref}
            {...props}
          />

          {icon && (
            <button
              type="button"
              onClick={onClickIcon}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                onClickIcon && "cursor-pointer"
              )}
            >
              {icon}
            </button>
          )}
        </div>

        {/* error nằm ngoài relative */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
