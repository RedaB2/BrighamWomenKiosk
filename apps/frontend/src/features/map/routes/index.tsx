import { Outlet, Route, Routes } from "react-router-dom";
import { Map } from "./Map";
import { Drawer as MapDrawer } from "../components";

const MapLayout = () => {
  return (
    <>
      <MapDrawer />
      <Outlet />
    </>
  );
};

export const MapRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MapLayout />}>
        <Route path="/" element={<Map />} />
      </Route>
    </Routes>
  );
};
