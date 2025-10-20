import { Skeleton } from "../ui/skeleton";

const DoctorScheduleCardSkeleton = () => {
  return (
    <div className="w-full rounded-xl border p-3 flex items-center justify-between bg-white">
      {/* icon + text giả */}
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
};

export default DoctorScheduleCardSkeleton;
