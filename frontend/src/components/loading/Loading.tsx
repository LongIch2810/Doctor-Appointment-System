import { Loader2 } from "lucide-react";
interface LoadingProps {
  size?: number;
}
const Loading = ({ size = 16 }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 size={size} className="animate-spin text-white" />
    </div>
  );
};

export default Loading;
