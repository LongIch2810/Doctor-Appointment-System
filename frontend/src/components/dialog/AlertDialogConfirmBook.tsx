import { CalendarDays, Stethoscope, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { formatDate, formatDateYYYYMMDD } from "@/utils/formatDate";
import Loading from "../loading/Loading";

interface AlertDialogConfirmBookProps {
  doctorId: number;
  doctorScheduleId: number;
  openConfirm: boolean;
  setOpenConfirm: (data: boolean) => void;
  selectedDate: Date;
  tempTime: { start_time: string; end_time: string };
  doctorName: string;
  specialtyName: string;
  isPending: boolean;
  setIsPending?: (data: boolean) => void;
  handleConfirm: (data: {
    appointment_date: string;
    doctor_id: number;
    doctor_schedule_id: number;
  }) => void;
}

const AlertDialogConfirmBook = ({
  doctorId,
  doctorScheduleId,
  openConfirm,
  setOpenConfirm,
  selectedDate,
  tempTime,
  doctorName,
  specialtyName,
  isPending,
  handleConfirm,
}: AlertDialogConfirmBookProps) => {
  return (
    <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
      <AlertDialogContent className="max-w-md rounded-2xl shadow-lg bg-white dark:bg-neutral-900">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary">
            <CalendarDays size={28} />
          </div>
          <AlertDialogTitle className="text-center text-xl font-bold">
            Xác nhận đặt lịch khám
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="text-center text-gray-600 dark:text-gray-300 space-y-2">
              <span>
                Bạn có chắc chắn muốn đặt lịch vào ngày{" "}
                <strong className="text-primary">
                  {formatDate(selectedDate, "vi-VN")}
                </strong>{" "}
                lúc{" "}
                <strong className="text-primary">
                  {tempTime?.start_time} - {tempTime?.end_time}
                </strong>
                ?
              </span>

              <div className="flex flex-col items-center gap-1 mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <Stethoscope size={18} className="text-primary" />
                  Bác sĩ: <strong>{doctorName}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  Chuyên khoa: <strong>{specialtyName}</strong>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between gap-4 mt-6">
          <AlertDialogCancel className="py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() =>
              handleConfirm({
                appointment_date: formatDateYYYYMMDD(selectedDate),
                doctor_id: doctorId,
                doctor_schedule_id: doctorScheduleId,
              })
            }
            className="py-2 rounded-xl bg-primary text-white hover:bg-white hover:text-primary"
          >
            {isPending ? <Loading /> : "Xác nhận"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogConfirmBook;
