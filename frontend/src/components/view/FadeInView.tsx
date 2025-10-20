import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants; // Cho phép custom animation riêng nếu cần
  once?: boolean; // Chạy 1 lần hay nhiều lần
  delay?: number; // Độ trễ
  duration?: number; // Thời gian animate
  amount?: number; // Bao nhiêu phần section vào viewport thì bắt đầu animate
}

const FadeInView = ({
  children,
  className,
  variants,
  once = false,
  delay = 0,
  duration = 0.6,
  amount = 0.2,
}: FadeInViewProps) => {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={
        variants || {
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, ease: "easeOut", delay },
          },
        }
      }
    >
      {children}
    </motion.section>
  );
};

export default FadeInView;
