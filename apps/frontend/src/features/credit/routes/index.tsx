import { Outlet, Route, Routes } from "react-router-dom";
import { Credit } from "./Credit.tsx";
import { ContentLayout } from "@/components";

const CreditLayout = () => {
  return (
    <ContentLayout>
      <Outlet />
    </ContentLayout>
  );
};

export const CreditRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CreditLayout />}>
        <Route path="/" element={<Credit />} />
      </Route>
    </Routes>
  );
};
