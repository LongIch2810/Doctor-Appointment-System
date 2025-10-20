import { useGetSpecialtiesInfinite } from "@/hooks/useGetSpecialtiesInfinite";
import SpecialtyCard from "../card/SpecialtyCard";
import Title from "../title/Title";
import { Skeleton } from "../ui/skeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import FadeInView from "../view/FadeInView";
import SpecialtyCardSkeleton from "../skeleton/SpecialtyCardSkeleton";

const SpecialtiesSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetSpecialtiesInfinite();
  const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
    hasNextPage,
    fetchNextPage,
  });

  return (
    <FadeInView>
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-3">
          <div className="text-center mb-6">
            <Title text="Đa dạng chuyên khoa khám"></Title>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
              Khám phá hơn{" "}
              <span className="font-semibold">20+ chuyên khoa</span>
              với đội ngũ bác sĩ giàu kinh nghiệm. LifeHealth giúp bạn dễ dàng
              lựa chọn đúng chuyên khoa, đúng bác sĩ để được chăm sóc sức khỏe
              toàn diện.
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-2 gap-5 md:gap-10 justify-items-center mt-5">
            {(isLoading || isError) &&
              Array.from({ length: 5 }).map((_, i) => (
                <SpecialtyCardSkeleton key={i} />
              ))}

            {data?.pages.map((page, i) => (
              <div key={i} className="contents">
                {page.data.specialties.map((item: any) => (
                  <SpecialtyCard key={item.id} specialtyProps={item} />
                ))}
              </div>
            ))}

            {isFetchingNextPage &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="flex flex-col items-center space-y-3"
                >
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            <div ref={loadMoreRef} className="h-1 col-span-full"></div>
          </div>
        </div>
      </section>
    </FadeInView>
  );
};

export default SpecialtiesSection;
