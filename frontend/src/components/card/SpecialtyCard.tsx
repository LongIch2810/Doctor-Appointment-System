import type { SpecialtyProps } from "@/types/global";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
const SpecialtyCard = ({
  specialtyProps,
}: {
  specialtyProps: SpecialtyProps;
}) => {
  return (
    <Card className="cursor-pointer w-full max-w-xs border-2 border-gray-300 hover:shadow-lg transition-all duration-300 rounded-2xl">
      <CardHeader className="flex flex-col items-center space-y-3">
        <img
          src={specialtyProps.img_url}
          alt={specialtyProps.name}
          className="w-16 h-16 object-cover rounded-full border border-gray-200"
        />
        <CardTitle className="text-base text-center">
          {specialtyProps.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default SpecialtyCard;
