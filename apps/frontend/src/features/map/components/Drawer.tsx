import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import {
  FaMapMarkedAlt,
  FaSignInAlt,
  FaDownload,
  FaMap,
  FaUserAlt,
  FaSignOutAlt,
  FaInfoCircle,
} from "react-icons/fa";
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
import { Link } from "react-router-dom";

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
  const { isAuthenticated, logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <FlowbiteSidebar
      aria-label="Navigation drawer"
      aria-labelledby={drawerId}
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
        <Link to="/" className="h-full flex-1 flex justify-center items-center">
          <img src={logoUrl} alt="Hospital logo" />
        </Link>
      </div>
      <FlowbiteSidebar.Items className="pt-4">
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item icon={FaMapMarkedAlt} as={Link} to="/">
            Hospital Map
          </FlowbiteSidebar.Item>
          {isAuthenticated && (
            <>
              <FlowbiteSidebar.Item
                icon={MdOutlineRoomService}
                as={Link}
                to="/services"
              >
                Request Services
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Collapse
                icon={FaDownload}
                label="Import/Export Data"
              >
                <FlowbiteSidebar.Item icon={FaMap} as={Link} to="/data/map">
                  Map Data
                </FlowbiteSidebar.Item>
                <FlowbiteSidebar.Item
                  icon={FaPeopleGroup}
                  as={Link}
                  to="/data/employees"
                >
                  Employees Data
                </FlowbiteSidebar.Item>
                <FlowbiteSidebar.Item
                  icon={MdOutlineRoomService}
                  as={Link}
                  to="/data/services"
                >
                  Service Requests Data
                </FlowbiteSidebar.Item>
              </FlowbiteSidebar.Collapse>
            </>
          )}
          <FlowbiteSidebar.Item icon={FaInfoCircle} as={Link} to="/about">
            About
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item>
            <DarkThemeToggle />
            Switch Theme
          </FlowbiteSidebar.Item>
          {isAuthenticated && (
            <FlowbiteSidebar.Item icon={FaUserAlt} as={Link} to="/auth/profile">
              Profile
            </FlowbiteSidebar.Item>
          )}
          {!isAuthenticated && (
            <FlowbiteSidebar.Item
              icon={FaSignInAlt}
              as={Link}
              to="/auth/sign-in"
            >
              Sign In
            </FlowbiteSidebar.Item>
          )}
          {isAuthenticated && (
            <FlowbiteSidebar.Item
              onClick={handleLogout}
              icon={FaSignOutAlt}
              as={Link}
              to="/"
            >
              Sign Out
            </FlowbiteSidebar.Item>
          )}
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
};

export { Drawer };
