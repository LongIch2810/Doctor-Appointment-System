import { cn } from "@/lib/utils";

export default function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-block h-3 w-3 rounded", color)} />
      <span>{label}</span>
    </div>
  );
}
