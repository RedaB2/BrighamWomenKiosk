import logoUrl from "/logo.png";
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
} from "flowbite-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
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

const SidebarNavigation = () => {
  const { isAuthenticated, logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <FlowbiteSidebar aria-label="Navigation sidebar" theme={sidebarTheme}>
      <Link to="/" reloadDocument>
        <img src={logoUrl} alt="Hospital logo" />
      </Link>
      <FlowbiteSidebar.Items className="pt-4">
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item
            icon={FaMapMarkedAlt}
            as={Link}
            to="/"
            reloadDocument
          >
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

type ContentLayoutProps = {
  children: React.ReactNode;
};

const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <div className="h-screen flex overflow-hidden bg-[#D5E2ED] dark:bg-slate-950">
      <SidebarNavigation />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export { ContentLayout };
