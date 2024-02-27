import { Outlet, Route, Routes } from "react-router-dom";
import { About } from "./About.tsx";
import { ContentLayout } from "@/components";

const AboutLayout = () => {
  return (
    <ContentLayout>
      <Outlet />
    </ContentLayout>
  );
};

export const AboutRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AboutLayout />}>
        <Route path="/" element={<About />} />
      </Route>
    </Routes>
  );
};
