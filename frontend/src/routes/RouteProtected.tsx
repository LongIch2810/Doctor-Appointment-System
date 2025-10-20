import { useUserStore } from "@/store/useUserStore";
import { Navigate, Outlet } from "react-router-dom";

const RouteProtected = () => {
  const { userInfo } = useUserStore();
  if (!userInfo) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
};

export default RouteProtected;
