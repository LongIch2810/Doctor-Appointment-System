import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

const SpecialtyCardSkeleton = () => {
  return (
    <Card className="cursor-pointer w-full max-w-xs border-2 border-gray-300 rounded-2xl">
      <CardHeader className="flex flex-col items-center space-y-3">
        {/* Ảnh chuyên khoa */}
        <Skeleton className="w-16 h-16 rounded-full" />

        {/* Tên chuyên khoa */}
        <Skeleton className="h-4 w-24 rounded" />
      </CardHeader>
    </Card>
  );
};

export default SpecialtyCardSkeleton;
