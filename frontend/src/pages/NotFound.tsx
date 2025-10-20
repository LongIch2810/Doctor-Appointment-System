import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-destructive" />
          <CardTitle className="text-2xl font-bold">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Quay về Trang chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
