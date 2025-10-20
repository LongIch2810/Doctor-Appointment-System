import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const DoctorCardSkeleton = () => {
  return (
    <Card className="w-full max-w-sm rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <CardHeader className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Tên bác sĩ */}
          <Skeleton className="h-3 w-20" /> {/* Nơi làm việc */}
          <Skeleton className="h-3 w-24" /> {/* Chuyên khoa */}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" /> {/* Điểm đánh giá */}
          <Skeleton className="h-4 w-28" /> {/* Ca hoàn tất */}
        </div>
        <Skeleton className="h-4 w-40" /> {/* Kinh nghiệm */}
        <Skeleton className="h-4 w-40" /> {/* Địa chỉ */}
        <Skeleton className="h-4 w-40" /> {/* Số điện thoại */}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col gap-3">
        <Skeleton className="h-10 w-full rounded-md" /> {/* Nút đặt lịch */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Nút xem chi tiết */}
      </CardFooter>
    </Card>
  );
};

export default DoctorCardSkeleton;
