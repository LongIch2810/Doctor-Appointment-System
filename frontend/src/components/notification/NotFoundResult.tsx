import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

interface NotFoundResultProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export default function NotFoundResult({
  title = "Không tìm thấy kết quả",
  description = "Vui lòng thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc.",
  onReset,
}: NotFoundResultProps) {
  return (
    <div className="flex justify-center items-center w-full py-10">
      <Card className="w-full max-w-md border border-gray-200 shadow-sm rounded-xl">
        <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
            <SearchX className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Tiêu đề */}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

          {/* Mô tả */}
          <p className="text-sm text-gray-500">{description}</p>

          {/* Nút đặt lại */}
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              className="mt-4 rounded-lg"
            >
              Đặt lại bộ lọc
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
