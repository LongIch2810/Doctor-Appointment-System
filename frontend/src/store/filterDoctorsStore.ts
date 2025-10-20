import { create } from "zustand";

type FilterDoctorsStore = {
  search: string;
  setSearch: (data: string) => void;
  specialtyIdSelect: number;
  setSpecialtyIdSelect: (data: number) => void;
  minExperienceSelect: number;
  setMinExperienceSelect: (data: number) => void;
  maxExperienceSelect: number;
  setMaxExperienceSelect: (data: number) => void;
  workplaceInput: string;
  setWorkplaceInput: (data: string) => void;
  areaSelect: string;
  setAreaSelect: (data: string) => void;
};

export const useFilterDoctorsStore = create<FilterDoctorsStore>()((set) => ({
  search: "",
  setSearch: (data: string) => set({ search: data }),
  specialtyIdSelect: 0,
  minExperienceSelect: 0,
  maxExperienceSelect: 0,
  workplaceInput: "",
  areaSelect: "",
  setSpecialtyIdSelect: (data: number) => set({ specialtyIdSelect: data }),
  setMinExperienceSelect: (data: number) => set({ minExperienceSelect: data }),
  setMaxExperienceSelect: (data: number) => set({ maxExperienceSelect: data }),
  setWorkplaceInput: (data: string) => set({ workplaceInput: data }),
  setAreaSelect: (data: string) => set({ areaSelect: data }),
}));
