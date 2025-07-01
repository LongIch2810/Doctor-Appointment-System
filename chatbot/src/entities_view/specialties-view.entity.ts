import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({ name: "specialties_view" })
export class SpecialtiesView {
  @ViewColumn()
  specialty_id!: number;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  description!: string;
}
