export interface User {
  id: string;
  name: string;
}

export interface DoctorProps {
  name: string;
  avatar: string;
  specialty: string;
  hospital: string;
  experience: number;
}

export interface TitleProps {
  text: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export interface SpecialtyProps {
  name: string;
  img_url: string;
}

export interface FeatureItemProps {
  title: string;
  className?: string;
  description: string;
}

export interface LineProps {
  color?: string;
  thickness?: string;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface FilterItemProps {
  className?: string;
  label: string;
  icon: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLElement>;
}
