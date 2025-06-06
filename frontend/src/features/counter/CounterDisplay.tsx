import React from "react";
import { useCounterStore } from "../../store/useCounterStore";

const CounterDisplay: React.FC = () => {
  const { count } = useCounterStore();
  return <p className="text-xl mb-2">Giá trị hiện tại: {count}</p>;
};

export default CounterDisplay;
