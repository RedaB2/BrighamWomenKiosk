import "./sideBar.css";

import groundFloor from "./MapImages/00_thegroundfloor.png";
import lowerLevel1 from "./MapImages/00_thelowerlevel1.png";
import lowerLevel2 from "./MapImages/00_thelowerlevel2.png";
import firstFloor from "./MapImages/01_thefirstfloor.png";
import secondFloor from "./MapImages/02_thesecondfloor.png";
import thirdFloor from "./MapImages/03_thethirdfloor.png";
import AutofillInput from "./AutofillInput.tsx";
import { useState } from "react";
import MenuBar from "@/routes/MenuBar.tsx";
//import "./MapStyles.css";

const MapRoute = () => {
  const [selectedFloor, setSelectedFloor] = useState("");

  return (
    <>
      <div>
        <MenuBar></MenuBar>
        <AutofillInput></AutofillInput>
        <select
          name="mapFloors"
          id="mapFloors"
          onChange={(e) => setSelectedFloor(e.target.value)}
        >
          <option value={groundFloor}>Ground Floor</option>
          <option value={lowerLevel1}>Lower Level 1</option>
          <option value={lowerLevel2}>Lower Level 2</option>
          <option value={firstFloor}>First Floor</option>
          <option value={secondFloor}>Second Floor</option>
          <option value={thirdFloor}>Third Floor</option>
        </select>
      </div>
      <img
        src={selectedFloor}
        alt={"Floor image"}
        width={"1000"}
        height={"auto"}
      />
    </>
  );
};
export default MapRoute;
