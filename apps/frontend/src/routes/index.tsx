import { createBrowserRouter } from "react-router-dom";
import SignInRoute from "./SignInRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInRoute />,
  },
]);
