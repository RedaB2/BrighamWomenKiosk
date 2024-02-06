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
import { IoMdClose } from "react-icons/io";

const drawerTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "fixed top-0 left-0 z-40 h-screen overflow-y-auto transition-transform -translate-x-full",
    inner:
      "h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 py-4 px-3 dark:bg-gray-800 flex flex-col",
    collapsed: {
      off: "w-96",
    },
  },
  logo: {
    base: "",
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
      <div className="flex space-x-4 items-center">
        <Button
          type="button"
          data-drawer-hide={drawerId}
          aria-controls={drawerId}
          outline
          label="Close navigation drawer"
        >
          <IoMdClose />
          <span className="sr-only">Close navigation drawer</span>
        </Button>
        <FlowbiteSidebar.Logo href="/" img={logoUrl} imgAlt="Hospital logo" />
      </div>
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

export { Drawer };
