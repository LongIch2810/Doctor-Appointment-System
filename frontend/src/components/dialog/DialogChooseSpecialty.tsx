import { useGetSpecialtiesInfinite } from "@/hooks/useGetSpecialtiesInfinite";
import { useFilterDoctorsStore } from "@/store/filterDoctorsStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import FilterItem from "../item/FilterItem";
import Loading from "../loading/Loading";

const DialogChooseSpecialty = ({ className = "" }: { className: string }) => {
  const { specialtyIdSelect, setSpecialtyIdSelect } = useFilterDoctorsStore();
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useGetSpecialtiesInfinite();
  const specialties =
    data?.pages.flatMap((page) => page.data.specialties) ?? [];

  const handleSelect = (specialty_id: number) => {
    setSpecialtyIdSelect(specialty_id);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <FilterItem
          label="Chuyên khoa"
          icon={<Stethoscope size={16} />}
          className={cn("w-full md:w-auto", className)}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn chuyên khoa</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Tìm kiếm chuyên khoa ..." />
          <CommandList>
            {(isLoading || isError) && <Loading />}
            <CommandEmpty>Không tìm thấy chuyên khoa.</CommandEmpty>
            <CommandGroup>
              {specialties.map((specialty: any) => (
                <CommandItem
                  key={specialty.id}
                  onSelect={() => handleSelect(specialty.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      specialtyIdSelect === specialty.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {specialty.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? <Loading /> : "Xem thêm"}
              </Button>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default DialogChooseSpecialty;
