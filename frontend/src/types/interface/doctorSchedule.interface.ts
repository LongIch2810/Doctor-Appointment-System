export interface DoctorSchedule {
  id: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  appointments: any;
}
