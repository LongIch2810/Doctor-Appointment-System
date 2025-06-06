// components/DoctorCarousel.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import DoctorCard from "../card/DoctorCard";
import type { DoctorProps } from "@/types/global";

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
];

export default function DoctorCarousel() {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {doctors.map((doc, idx) => (
              <CarouselItem
                key={idx}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <DoctorCard doctorProps={doc} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Prev / Next Buttons */}
          <CarouselPrevious className="absolute -left-5 top-1/2 -translate-y-1/2 z-20" />
          <CarouselNext className="absolute -right-5 top-1/2 -translate-y-1/2 z-20" />
        </Carousel>
      </div>
    </div>
  );
}
