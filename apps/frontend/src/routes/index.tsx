import { createBrowserRouter } from "react-router-dom";
import SignInRoute from "./SignInRoute.tsx";
import MapRoute from "./MapRoute.tsx";
import ResetPasswordRoute from "./ResetPasswordRoute.tsx";
import NewAccountRoute from "./NewAccountRoute.tsx";

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
  {
    path: "/new-account",
    element: <NewAccountRoute />,
  },
]);
