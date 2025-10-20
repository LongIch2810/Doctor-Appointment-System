import { useEffect, useState } from "react";

export function useNow(interval = 1000 * 60) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return now;
}
