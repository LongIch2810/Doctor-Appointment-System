import { useEffect, useRef } from "react";

interface useInfiniteScrollOptions {
  enabled?: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll<T extends HTMLElement>({
  enabled = true,
  hasNextPage,
  fetchNextPage,
  threshold = 0.5,
  rootMargin = "100px",
}: useInfiniteScrollOptions) {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled || !hasNextPage || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [enabled, hasNextPage, fetchNextPage, threshold, rootMargin]);

  return targetRef;
}
