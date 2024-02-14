import logoUrl from "/logo.png";
import { FaMapMarkedAlt, FaSignInAlt, FaDownload, FaMap } from "react-icons/fa";
import { MdOutlineRoomService } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  Sidebar as FlowbiteSidebar,
  DarkThemeToggle,
  CustomFlowbiteTheme,
} from "flowbite-react";

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
  return (
    <FlowbiteSidebar aria-label="Navigation sidebar" theme={sidebarTheme}>
      <FlowbiteSidebar.Logo href="/" img={logoUrl} imgAlt="Hospital logo" />
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
          <FlowbiteSidebar.Item href="/auth/sign-in" icon={FaSignInAlt}>
            Sign In
          </FlowbiteSidebar.Item>
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
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-neutral-900">
      <SidebarNavigation />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export { ContentLayout };
