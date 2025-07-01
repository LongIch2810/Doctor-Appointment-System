import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({ name: "doctors_view" })
export class DoctorsView {
  @ViewColumn()
  doctor_id!: number;

  @ViewColumn()
  fullname!: string;

  @ViewColumn()
  email!: string;

  @ViewColumn()
  phone!: string;

  @ViewColumn()
  address!: string;

  @ViewColumn()
  gender!: string;

  @ViewColumn()
  picture!: string;

  @ViewColumn()
  dateOfBirth!: Date;

  @ViewColumn()
  experience!: string;

  @ViewColumn()
  about_me!: string;

  @ViewColumn()
  workplace!: string;

  @ViewColumn()
  specialty!: string;

  @ViewColumn()
  schedules!: string;
}
