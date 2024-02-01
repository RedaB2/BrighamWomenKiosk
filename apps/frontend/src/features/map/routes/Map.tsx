import { useState } from "react";
import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import {
  Sidebar as FlowbiteSidebar,
  Button,
  CustomFlowbiteTheme,

} from "flowbite-react";
import { LocationSearch } from "../components/LocationSearch";


import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {

  root: {
    base: "h-full",
  },
  logo: {
    img: "",
  },
};

type SidebarProps = {
  setSelectedFloor: (value: string) => void;
};

const Sidebar = ({ setSelectedFloor }: SidebarProps) => {
  return (
    <FlowbiteSidebar aria-label="Map sidebar" theme={sidebarTheme}>
      <Button
        data-drawer-target={drawerId}
        data-drawer-show={drawerId}
        aria-controls={drawerId}
      >
        Show navigation
      </Button>
      <FlowbiteSidebar.Logo href="/" img={logoUrl} imgAlt="Hospital logo" />
      
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item>
            <select
              className="w-full"
              name="mapFloor"
              id="mapFloor"
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value={groundFloor}>Ground Floor</option>
              <option value={lowerLevel1}>Lower Level 1</option>
              <option value={lowerLevel2}>Lower Level 2</option>
              <option value={firstFloor}>First Floor</option>
              <option value={secondFloor}>Second Floor</option>
              <option value={thirdFloor}>Third Floor</option>
            </select>
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item>
            <LocationSearch />
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
};

const Map = () => {
  const [selectedFloor, setSelectedFloor] = useState(groundFloor);
  return (
    <div className="flex">
      <Sidebar setSelectedFloor={setSelectedFloor} />
      <img
        src={selectedFloor}
        alt={"Floor image"}
        width={"1000"}
        height={"auto"}
      />
    </div>
  );
};

export { Map };
