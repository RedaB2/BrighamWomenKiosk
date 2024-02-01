import { Outlet, Route, Routes } from "react-router-dom";
import { ContentLayout } from "@/components";

import { CSVData } from "./CSVData";

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
        <Route path="/map" element={<CSVData />} />
        {/* <Route path="/services" element={<CSVData />} /> */}
      </Route>
    </Routes>
  );
};
