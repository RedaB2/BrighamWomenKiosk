import { useRoutes } from "react-router-dom";
import { AuthRoutes } from "@/features/auth";
import { MapRoutes } from "@/features/map";
import { ServicesRoutes } from "@/features/services";
import { DataRoutes } from "@/features/data";

export const AppRoutes = () => {
  const element = useRoutes([
    {
      path: "/*",
      element: <MapRoutes />,
    },
    {
      path: "/services/*",
      element: <ServicesRoutes />,
    },
    {
      path: "/data/*",
      element: <DataRoutes />,
    },
    {
      path: "/auth/*",
      element: <AuthRoutes />,
    },
  ]);
  return <>{element}</>;
};
