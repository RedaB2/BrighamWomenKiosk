import { Outlet, Route, Routes } from "react-router-dom";
import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";
import { ResetPassword } from "./ResetPassword";
import { ContentLayout } from "@/components";

const AuthLayout = () => {
  return (
    <ContentLayout>
      <Outlet />
    </ContentLayout>
  );
};

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
};
