import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { DoctorProps } from "@/types/global";

export default function DoctorCard({
  doctorProps,
}: {
  doctorProps: DoctorProps;
}) {
  return (
    <Card className="w-full max-w-sm shadow-lg rounded-2xl border-2 border-gray-300">
      <CardHeader className="flex items-center gap-4">
        <img
          src={doctorProps.avatar}
          alt="Dr. John Doe"
          className="w-16 h-16 rounded-full object-cover border border-gray-200"
        />
        <div>
          <CardTitle className="text-lg">{doctorProps.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {doctorProps.specialty}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{doctorProps.hospital}</p>
        <p className="text-sm text-muted-foreground">
          Kinh nghiệm: {doctorProps.experience} năm
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <Button className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4" />
          Đặt lịch khám
        </Button>
      </CardFooter>
    </Card>
  );
}
