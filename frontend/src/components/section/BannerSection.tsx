import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Typewriter } from "react-simple-typewriter";
import FadeInView from "../view/FadeInView";
const BannerSection = () => {
  return (
    <FadeInView>
      <section className="container mx-auto w-full h-[500px] relative rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row">
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
          {/* Main title */}
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
      </section>
    </FadeInView>
  );
};

export default BannerSection;
