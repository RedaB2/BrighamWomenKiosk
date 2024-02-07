import { Outlet, Route, Routes } from "react-router-dom";
import { ContentLayout } from "@/components";

import { MapData, EmployeesData, ServicesData } from "../components";

const DataLayout = () => {
  return (
    <ContentLayout>
      <Outlet />
    </ContentLayout>
  );
};

export const DataRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DataLayout />}>
        <Route path="/map" element={<MapData />} />
        <Route path="/employees" element={<EmployeesData />} />
        <Route path="/services" element={<ServicesData />} />
      </Route>
    </Routes>
  );
};
