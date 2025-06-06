import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/layouts/MainLayout";
import FilterItem from "../components/item/FilterItem";
import { CalendarCheck, MapPin, Stethoscope, Search } from "lucide-react";
import type { DoctorProps } from "@/types/global";
import DoctorCard from "@/components/card/DoctorCard";

const doctors: DoctorProps[] = [
  {
    name: "Dr. John Doe",
    avatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Nội tổng quát",
    experience: 5,
    hospital: "Bệnh viên Bạch Mai",
  },
  {
    name: "Dr. Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Nhi khoa",
    experience: 5,
    hospital: "Bệnh viên Đa khoa",
  },
  {
    name: "Dr. Alan Turing",
    avatar:
      "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Da liễu",
    experience: 5,
    hospital: "Bệnh viên Việt Đức",
  },
  {
    name: "Dr. Adam Woods",
    avatar:
      "https://plus.unsplash.com/premium_photo-1681996484614-6afde0d53071?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Da liễu",
    experience: 5,
    hospital: "Bệnh viên CuBa",
  },
  {
    name: "Dr. John Doe",
    avatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Nội tổng quát",
    experience: 5,
    hospital: "Bệnh viên Bạch Mai",
  },
  {
    name: "Dr. Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Nhi khoa",
    experience: 5,
    hospital: "Bệnh viên Đa khoa",
  },
  {
    name: "Dr. Alan Turing",
    avatar:
      "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Da liễu",
    experience: 5,
    hospital: "Bệnh viên Việt Đức",
  },
  {
    name: "Dr. Adam Woods",
    avatar:
      "https://plus.unsplash.com/premium_photo-1681996484614-6afde0d53071?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Da liễu",
    experience: 5,
    hospital: "Bệnh viên CuBa",
  },
  {
    name: "Dr. Adam Woods",
    avatar:
      "https://plus.unsplash.com/premium_photo-1681996484614-6afde0d53071?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Da liễu",
    experience: 5,
    hospital: "Bệnh viên CuBa",
  },
  {
    name: "Dr. Adam Woods",
    avatar:
      "https://plus.unsplash.com/premium_photo-1681996484614-6afde0d53071?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    specialty: "Da liễu",
    experience: 5,
    hospital: "Bệnh viên CuBa",
  },
];

const Doctor = () => {
  return (
    <MainLayout>
      <section className="mt-16 md:mt-28">
        <header className="md:mx-16">
          <div className="flex items-center justify-center gap-x-3 md:mx-16">
            <Input
              placeholder="Tìm kiếm bác sĩ..."
              className="md:w-3/4 px-5 py-4 rounded-full border-2 bg-white border-gray-300 placeholder:text-gray-400 shadow-md text-gray-800 italic"
            />
            <Button className="hidden md:block">Tìm kiếm</Button>
            <Button className="md:hidden">
              <Search size={6} />
            </Button>
          </div>
          <div className="flex md:flex-row flex-col md:items-center justify-center gap-y-3 md:gap-x-5 mt-5">
            <FilterItem
              label="Chọn chuyên khoa"
              icon={<Stethoscope size={16} />}
              onClick={() => console.log("Clicked chuyên khoa")}
            />
            <FilterItem
              label="Khu vực"
              icon={<MapPin size={16} />}
              onClick={() => console.log("Clicked khu vực")}
            />
            <FilterItem
              label="Năm kinh nghiệm"
              icon={<CalendarCheck size={16} />}
              onClick={() => console.log("Clicked kinh nghiệm")}
            />
          </div>
        </header>
        <div className="mt-10 md:mt-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-20">
            {doctors.map((item, index) => (
              <DoctorCard key={index} doctorProps={item} />
            ))}
          </div>
          <div></div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Doctor;
