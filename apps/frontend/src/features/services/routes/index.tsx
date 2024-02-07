import { Outlet, Route, Routes } from "react-router-dom";
import { ServiceRequest } from "./ServiceRequest";
import { ContentLayout } from "@/components";

const ServicesLayout = () => {
  return (
    <ContentLayout>
      <Outlet />
    </ContentLayout>
  );
};

export const ServicesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ServicesLayout />}>
        <Route path="/" element={<ServiceRequest />} />
      </Route>
    </Routes>
  );
};
