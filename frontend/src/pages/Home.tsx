import { Input } from "@/components/ui/input";
import MainLayout from "@/layouts/MainLayout";
import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import DoctorCarousel from "../components/carousel/DoctorCarousel";
import Title from "@/components/title/Title";
import { Button } from "@/components/ui/button";
import type { SpecialtyProps } from "@/types/global";
import SpecialtyCard from "@/components/card/SpecialtyCard";
import FeatureItem from "../components/item/FeatureItem";
import Line from "@/components/line/Line";

const specialties: SpecialtyProps[] = [
  {
    name: "Nội tổng quát",
    img_url: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  },
  {
    name: "Nhi khoa",
    img_url:
      "https://img.icons8.com/?size=100&id=p2d1FgnXor9x&format=png&color=000000",
  },
  {
    name: "Tai - Mũi - Họng",
    img_url:
      "https://img.icons8.com/?size=100&id=rTQ4En7AeuQ1&format=png&color=000000",
  },
  {
    name: "Tim mạch",
    img_url:
      "https://img.icons8.com/?size=100&id=iUw8YXRVW2S0&format=png&color=000000",
  },
  {
    name: "Da liễu",
    img_url:
      "https://img.icons8.com/?size=100&id=MOj6Zjf10vZv&format=png&color=000000",
  },
  {
    name: "Xương khớp",
    img_url:
      "https://img.icons8.com/?size=100&id=sAzBTj4hB0gT&format=png&color=000000",
  },
  {
    name: "Phụ sản",
    img_url:
      "https://img.icons8.com/?size=100&id=Kk8ICotGvcA9&format=png&color=000000",
  },
  {
    name: "Tiêu hóa",
    img_url:
      "https://img.icons8.com/?size=100&id=EvRCUVdDhhgF&format=png&color=000000",
  },
  {
    name: "Thần kinh",
    img_url:
      "https://img.icons8.com/?size=100&id=Cuq2YZuRDrbi&format=png&color=000000",
  },
  {
    name: "Mắt",
    img_url:
      "https://img.icons8.com/?size=100&id=113879&format=png&color=000000",
  },
  {
    name: "Răng - Hàm - Mặt",
    img_url:
      "https://img.icons8.com/?size=100&id=64450&format=png&color=000000",
  },
  {
    name: "Ung bướu",
    img_url:
      "https://img.icons8.com/?size=100&id=LUYKebvCUxz9&format=png&color=000000",
  },
  {
    name: "Hô hấp",
    img_url:
      "https://img.icons8.com/?size=100&id=Z3a9Q1E2ZCw3&format=png&color=000000",
  },
  {
    name: "Thận - Tiết niệu",
    img_url:
      "https://img.icons8.com/?size=100&id=81090&format=png&color=000000",
  },
  {
    name: "Lão khoa",
    img_url:
      "https://img.icons8.com/?size=100&id=ysp3HiIhyRdn&format=png&color=000000",
  },
];

const Home: React.FC = () => {
  return (
    <MainLayout>
      <section className="mt-16 md:mt-28">
        {/* Banner 2-column layout */}
        <div className="w-full h-[500px] relative rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row">
          {/* Left column - 30% image */}
          <div className="md:w-1/3 w-full h-60 md:h-auto">
            <img
              src="/banner.jpg"
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right column - 70% content */}
          <div
            className="flex-1 flex flex-col items-center justify-center text-center px-6 space-y-4"
            style={{ backgroundColor: "oklch(0.72 0.11 178)" }}
          >
            {/* Main title - Hiển thị đầu tiên */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white text-xl md:text-3xl font-extrabold"
            >
              Ứng dụng đặt khám
            </motion.h2>

            {/* Typewriter description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-white text-xs md:text-base font-semibold px-4 py-2 max-w-2xl"
            >
              <Typewriter
                words={[
                  "Đặt khám với hơn 1000+ bác sĩ, 25+ bệnh viện, 100+ phòng khám trên LifeHealth để có số thứ tự và khung giờ khám trước.",
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </motion.p>

            {/* Search input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="w-full max-w-md"
            >
              <Input
                placeholder="Tìm kiếm bác sĩ..."
                className="w-full px-5 py-4 rounded-full border-2 bg-white border-gray-300 placeholder:text-gray-400 shadow-md text-gray-800 italic"
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-y-10 md:gap-y-20">
          {/*Sologan*/}
          <div className="flex justify-center mt-6 md:mt-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-gray-700 text-lg md:text-2xl font-semibold px-4 py-2 max-w-2xl"
            >
              <Typewriter
                words={[
                  "Đặt lịch nhanh – Khám khỏe mạnh!",
                  "Chủ động hẹn khám – An tâm sức khỏe!",
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </motion.h2>
          </div>

          {/*Carousel*/}
          <div>
            <div className="flex flex-col md:flex-row items-center md:justify-between">
              <Title text="Bác sĩ nổi bật" align="left"></Title>
              <Button className="py-0.5 md:text-base text-xs">Xem thêm</Button>
            </div>
            <div className="relative flex items-center justify-center mt-5">
              <DoctorCarousel></DoctorCarousel>
            </div>
          </div>

          {/*Specialties*/}
          <div>
            <Title text="Đa dạng chuyên khoa khám"></Title>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-2 gap-10 md:gap-20 justify-items-center mt-5">
              {specialties &&
                specialties.map((item) => (
                  <SpecialtyCard key={item.name} specialtyProps={item} />
                ))}
            </div>
          </div>

          {/*Feel free to search for and book a doctor.*/}
          <div>
            <div>
              <Title text="An tâm tìm và đặt bác sĩ"></Title>
              <p className="text-gray-500 text-center text-xs md:text-sm">
                Hơn 600 bác sĩ liên kết chính thức với LifeHealth.
              </p>
            </div>
            <div className="flex mt-10 md:flex-row flex-col">
              <div className="md:w-3/4 w-full h-60 md:h-auto">
                <img
                  src="https://youmed.vn/dat-kham/assets/img/booking/png/Doctor/Feature1.webp" // Thay bằng đường dẫn thực tế
                  alt="image"
                  width={400}
                  height={400}
                  className="max-w-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <FeatureItem
                  title="Đội ngũ bác sĩ"
                  description="Tất cả các bác sĩ đều có liên kết chính thức với YouMed để bảo đảm lịch đặt khám của bạn được xác nhận."
                  className="md:flex-1"
                />
                <Line />
                <FeatureItem
                  className="md:flex-1"
                  title="Đặt khám dễ dàng, nhanh chóng, chủ động"
                  description="Chỉ với 1 phút, bạn có thể đặt khám thành công với bác sĩ. Phiếu khám bao gồm số thứ tự và khung thời gian dự kiến."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
