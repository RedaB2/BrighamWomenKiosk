import { useRoutes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthRoutes } from "@/features/auth";
import { MapRoutes } from "@/features/map";
import { ServicesRoutes } from "@/features/services";
import { DataRoutes } from "@/features/data";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth0();

  const publicRoutes = [
    {
      path: "/*",
      element: <MapRoutes />,
    },
    {
      path: "/auth/*",
      element: <AuthRoutes />,
    },
  ];

  const protectedRoutes = isAuthenticated
    ? [
        {
          path: "/services/*",
          element: <ServicesRoutes />,
        },
        {
          path: "/data/*",
          element: <DataRoutes />,
        },
      ]
    : [];

  const element = useRoutes([...publicRoutes, ...protectedRoutes]);

  return <>{element}</>;
};
