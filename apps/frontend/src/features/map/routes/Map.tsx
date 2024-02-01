import { useState } from "react";
import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import {
  Sidebar as FlowbiteSidebar,
  Button,
  CustomFlowbiteTheme,
  Label,
  TextInput,
} from "flowbite-react";
import { CiSearch } from "react-icons/ci";

import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
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
      <form>
        <div className="mb-2 block">
          <Label
            id="startLocation"
            htmlFor="startLocation"
            value="Enter starting point"
          />
        </div>
        <TextInput
          type="text"
          placeholder="Medical Records Conference Room Floor L1"
          required
          rightIcon={CiSearch}
        />
        <div className="mb-2 block">
          <Label htmlFor="endLocation" value="Enter destination" />
        </div>
        <TextInput
          id="endLocation"
          type="text"
          placeholder="Nuclear Medicine Floor L1"
          required
          rightIcon={CiSearch}
        />
      </form>
      <select
        className="mt-4 w-full"
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
