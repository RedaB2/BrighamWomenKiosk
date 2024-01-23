import { createBrowserRouter } from "react-router-dom";
import SignInRoute from "./SignInRoute.tsx";
import MapRoute from "./MapRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInRoute />,
  },
    {
        path: "/map",
        element: <MapRoute />,
    },
]);
