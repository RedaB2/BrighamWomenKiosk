import { createBrowserRouter } from "react-router-dom";
import SignInRoute from "./SignInRoute.tsx";
import MapRoute from "./MapRoute.tsx";
import ResetPasswordRoute from "./ResetPasswordRoute.tsx";
import NewAccountRoute from "./NewAccountRoute.tsx";
import CSVDataRoute from "@/routes/CSVDataRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInRoute />,
  },
  {
    path: "/",
    element: <MapRoute />,
  },
  {
    path: "/sign-in/reset-password",
    element: <ResetPasswordRoute />,
  },
  {
    path: "/csv-data",
    element: <CSVDataRoute />,
  },
  {
    path: "/sign-in/new-account",
    element: <NewAccountRoute />,
  },
]);
