import { Typewriter } from "react-simple-typewriter";
import FadeInView from "../view/FadeInView";
const SloganSection = () => {
  return (
    <FadeInView>
      <section className="flex justify-center mt-6 md:mt-10">
        <p className="text-gray-700 text-lg md:text-2xl font-semibold px-4 py-2 max-w-2xl text-center">
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
        </p>
      </section>
    </FadeInView>
  );
};

export default SloganSection;
