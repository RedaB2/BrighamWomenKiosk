import { createBrowserRouter } from "react-router-dom";
import SignInRoute from "./SignInRoute.tsx";
import MapRoute from "./MapRoute.tsx";
import ResetPasswordRoute from "./ResetPasswordRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInRoute />,
  },
  {
    path: "/map",
    element: <MapRoute />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordRoute />,
  },
]);
