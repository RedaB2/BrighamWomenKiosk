import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import { FaMapMarkedAlt, FaSignInAlt, FaDownload, FaMap, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineRoomService } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  Sidebar as FlowbiteSidebar,
  DarkThemeToggle,
  CustomFlowbiteTheme,
  Button,
} from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { useAuth0 } from "@auth0/auth0-react";

const drawerTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "fixed top-0 left-0 z-40 h-screen overflow-y-auto transition-transform -translate-x-full",
    inner:
      "h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 py-4 px-3 dark:bg-gray-800 flex flex-col",
    collapsed: {
      off: "w-80",
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

  const { isAuthenticated } = useAuth0();

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
          <FlowbiteSidebar.Collapse
            icon={FaDownload}
            label="Import/Export Data"
          >
            <FlowbiteSidebar.Item href="/data/map" icon={FaMap}>
              Map Data
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/data/employees" icon={FaPeopleGroup}>
              Employees Data
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item
              href="/data/services"
              icon={MdOutlineRoomService}
            >
              Service Requests Data
            </FlowbiteSidebar.Item>
          </FlowbiteSidebar.Collapse>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item>
            <DarkThemeToggle />
            Switch Theme
          </FlowbiteSidebar.Item>
            {!isAuthenticated && <FlowbiteSidebar.Item href="/auth/sign-in" icon={FaSignInAlt}>
            Sign In
          </FlowbiteSidebar.Item>}
            {isAuthenticated && <FlowbiteSidebar.Item href="/auth/sign-in" icon={FaSignOutAlt}>
                Sign Out
            </FlowbiteSidebar.Item>}
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
};

export { Drawer };
