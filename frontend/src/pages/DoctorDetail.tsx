import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetDoctorDetail } from "@/hooks/useGetDoctorDetail";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, GraduationCap, Stethoscope } from "lucide-react";
import CalendarComponent from "../components/calendar/CalendarComponent";
import { useBookingAppointmentStore } from "@/store/bookingAppointmentStore";
import { getWeekday } from "@/utils/formatDate";
import DoctorScheduleList from "@/components/list/DoctorScheduleList";
import { formatDate, formatDateYYYYMMDD } from "../utils/formatDate";
import { Button } from "@/components/ui/button";
import { checkSchedulesExpireOrBooked } from "@/utils/checkSchedulesExpire";
import { useBookingAppointment } from "@/hooks/useBookingAppointment";
import type { createAppointmentData } from "@/api/appointmentApi";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/interface/apiError.interface";
import Loading from "@/components/loading/Loading";
import { useGetDoctorSchedules } from "@/hooks/useGetDoctorSchedules";
import DoctorInfoSkeleton from "@/components/skeleton/DoctorInfoSkeleton";
import DoctorScheduleListSkeleton from "@/components/skeleton/DoctorScheduleListSkeleton";
import { useNotifyAppointmentSocket } from "@/hooks/useNotifyAppointmentSocket";
import { useSocket } from "@/hooks/useSocket";
import AlertDialogConfirmBook from "@/components/dialog/AlertDialogConfirmBook";
import { useUserStore } from "@/store/useUserStore";

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userInfo } = useUserStore();
  const [isPending, setIsPending] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const {
    selectedDate,
    setSelectedDate,
    doctor_id,
    setDoctorId,
    doctor_schedule_id,
    setDoctorScheduleId,
    tempTime,
    setTempTime,
  } = useBookingAppointmentStore();
  const socket = useSocket(userInfo?.id);
  useNotifyAppointmentSocket(socket, doctor_id, setIsPending);

  const { mutate, error, isError: isErrorBooking } = useBookingAppointment();

  useEffect(() => {
    const selectedDateParam = searchParams.get("selectedDate");
    const urlSelectedDate = selectedDateParam
      ? new Date(selectedDateParam)
      : new Date();
    const urlDoctorScheduleId =
      Number(searchParams.get("doctorScheduleId")) || 0;
    const urlStartTime = searchParams.get("startTime") || "";
    const urlEndTime = searchParams.get("endTime") || "";

    setSelectedDate(urlSelectedDate);
    setDoctorScheduleId(urlDoctorScheduleId);
    setTempTime({ start_time: urlStartTime, end_time: urlEndTime });
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedDate) params.selectedDate = formatDateYYYYMMDD(selectedDate);
    if (doctor_schedule_id)
      params.doctorScheduleId = doctor_schedule_id.toString();
    if (id) setDoctorId(Number(id));
    if (tempTime?.start_time) params.startTime = tempTime.start_time;
    if (tempTime?.end_time) params.endTime = tempTime.end_time;

    setSearchParams(params);
  }, [selectedDate, id, doctor_schedule_id, tempTime]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (isErrorBooking) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        typeof axiosError.response?.data.error.details === "string"
          ? axiosError.response?.data.error.details
          : axiosError.response?.data.error.details[0];
      toast.error(message);
    }
  }, [isErrorBooking]);

  const {
    data: doctorRes,
    isLoading,
    isError,
  } = useGetDoctorDetail(Number(id));

  const { data: doctorSchedulesRes, isLoading: isLoadingSchedules } =
    useGetDoctorSchedules(Number(id));

  if (isLoading || isLoadingSchedules) {
    return <DoctorInfoSkeleton />;
  }

  if (isError || !doctorRes?.data) {
    return (
      <div className="container mx-auto p-6 text-red-500">
        Không tìm thấy bác sĩ.
      </div>
    );
  }

  const doctor = doctorRes.data;
  const schedules = doctorSchedulesRes?.data || [];

  const handleBookingAppointment = (data: createAppointmentData) => {
    if (!data.appointment_date) {
      toast.error("Vui lòng chọn ngày khám !");
    } else if (!data.doctor_id) {
      toast.error("Vui lòng chọn bác sĩ !");
    } else if (!data.doctor_schedule_id) {
      toast.error("Vui lòng chọn khung giờ khám !");
    } else {
      setIsPending(true);
      mutate(data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl mt-16 md:mt-28 space-y-8">
      {/* Profile bác sĩ */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="w-28 h-28 ring-2 ring-primary/40">
            <AvatarImage src={doctor.user.picture} />
            <AvatarFallback>{doctor.user.fullname[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {doctor.user.fullname}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
              <Stethoscope size={20} />
              <span>
                {doctor.doctor_level} – {doctor.specialty.name}
              </span>
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 flex items-center justify-center sm:justify-start gap-2">
              <MapPin size={20} />
              <span>{doctor.workplace}</span>
            </p>
            <Badge
              variant="secondary"
              className="mt-2 text-xs sm:text-sm md:text-base py-1 px-3"
            >
              <GraduationCap size={16} className="mr-1" />
              {doctor.experience} năm kinh nghiệm
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Body Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Giới thiệu */}
          <section className="space-y-3">
            <h3 className="font-semibold text-base sm:text-lg md:text-xl border-b pb-2">
              Giới thiệu
            </h3>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {doctor.about_me || "Chưa có thông tin giới thiệu."}
            </p>
          </section>

          {/* Thông tin liên hệ */}
          <section className="space-y-3">
            <h3 className="font-semibold text-base sm:text-lg md:text-xl border-b pb-2">
              Thông tin liên hệ
            </h3>
            <ul className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-medium">Điện thoại</p>
                  <p>{doctor.user.phone}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>{doctor.user.email}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p>{doctor.user.address}</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Lịch làm việc */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-6 space-y-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Lịch làm việc
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {/* Lịch ngày - luôn render */}
            <CalendarComponent />
          </div>

          <Separator className="md:hidden block" />

          <div className="flex-1 space-y-4">
            {/* Ca khám ngày */}
            {!doctorSchedulesRes ? (
              <Skeleton className="h-6 w-1/2" />
            ) : (
              <h4 className="text-sm sm:text-base md:text-lg font-medium">
                Ca khám ngày {formatDate(selectedDate, "vi-VN")}
              </h4>
            )}

            {/* Có bao nhiêu khung giờ */}
            {!doctorSchedulesRes ? (
              <Skeleton className="h-6 w-1/3" />
            ) : (
              <h4 className="text-sm sm:text-base md:text-lg font-medium">
                Có {schedules[getWeekday(selectedDate)]?.length || 0} khung giờ
                khám
              </h4>
            )}

            {/* Danh sách ca khám */}
            {isLoadingSchedules && !doctorSchedulesRes ? (
              <DoctorScheduleListSkeleton />
            ) : (
              <DoctorScheduleList
                list={schedules[getWeekday(selectedDate)] || []}
                selectedDate={selectedDate}
              />
            )}

            {/* Nút đặt lịch */}
            {isLoadingSchedules && !doctorSchedulesRes ? (
              <div className="flex justify-center">
                <Skeleton className="h-10 w-40 rounded-xl" />
              </div>
            ) : (
              schedules &&
              schedules[getWeekday(selectedDate)]?.length > 0 &&
              !checkSchedulesExpireOrBooked(
                schedules[getWeekday(selectedDate)],
                selectedDate
              ) && (
                <div className="flex justify-center">
                  <Button
                    disabled={isPending}
                    onClick={() => setOpenConfirm(true)}
                    className="w-full md:w-auto"
                  >
                    {isPending ? <Loading /> : "Đặt lịch khám"}
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {openConfirm && (
        <AlertDialogConfirmBook
          doctorId={doctor_id}
          doctorName={doctor?.user?.fullname}
          doctorScheduleId={doctor_schedule_id}
          handleConfirm={handleBookingAppointment}
          isPending={isPending}
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
          selectedDate={selectedDate}
          specialtyName={doctor?.specialty?.name}
          tempTime={tempTime}
        />
      )}
    </div>
  );
};

export default DoctorDetail;
