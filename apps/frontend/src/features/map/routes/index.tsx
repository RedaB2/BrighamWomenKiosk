import { Outlet, Route, Routes } from "react-router-dom";
import { Map } from "./Map";
import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import { FaMapMarkedAlt, FaSignInAlt, FaDownload } from "react-icons/fa";
import { MdOutlineRoomService } from "react-icons/md";
import {
  Sidebar as FlowbiteSidebar,
  DarkThemeToggle,
  CustomFlowbiteTheme,
  Button,
} from "flowbite-react";

const drawerTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "fixed top-0 left-0 z-40 h-screen overflow-y-auto transition-transform -translate-x-full",
    inner:
      "h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 py-4 px-3 dark:bg-gray-800 flex flex-col",
  },
  logo: {
    img: "",
  },
  items: {
    base: "flex-1 flex flex-col justify-between",
  },
};

const Drawer = () => {
  return (
    <FlowbiteSidebar
      aria-label="Navigation drawer"
      theme={drawerTheme}
      tabIndex={-1}
      id={drawerId}
    >
      <Button
        type="button"
        data-drawer-hide={drawerId}
        aria-controls={drawerId}
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Close menu</span>
      </Button>
      <FlowbiteSidebar.Logo href="/" img={logoUrl} imgAlt="Hospital logo" />
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="/" icon={FaMapMarkedAlt}>
            Hospital Map
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/services" icon={MdOutlineRoomService}>
            Request Services
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/data/map" icon={FaDownload}>
            Import/Export Data
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item>
            <DarkThemeToggle />
            Switch Theme
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/auth/sign-in" icon={FaSignInAlt}>
            Sign In
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
};

const MapLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      <Drawer />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
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
