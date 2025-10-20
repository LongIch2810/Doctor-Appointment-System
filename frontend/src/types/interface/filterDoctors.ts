export interface filterDoctors {
  page: number;
  limit: number;
  specialty_id?: number;
  min_experience?: number;
  max_experience?: number;
  workplace?: string;
  area?: string;
  search?: string;
}

export interface filterDoctorsOptional {
  specialty_id?: number;
  min_experience?: number;
  max_experience?: number;
  workplace?: string;
  area?: string;
  search?: string;
}
