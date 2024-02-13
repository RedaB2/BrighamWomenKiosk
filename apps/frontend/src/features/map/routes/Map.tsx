import { useState } from "react";
//import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import {
  Sidebar,
  DirectionsContext,
  StartContext,
  EndContext,
} from "../components";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import BeefletMap from "@/features/map/components/BeefletMap.tsx";

const Map = () => {
  const [selectedFloor, setSelectedFloor] = useState(lowerLevel1);
  const [path, setPath] = useState<string[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // const mapStyles = {
  //   width: "100%",
  //   height: "100vh",
  // };

  // useEffect(() => {
  //   L.map("beeflet", {
  //     center: [52, 4],
  //     zoom: 4,
  //     layers: [
  //       L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  //         attribution:
  //           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //       }),
  //     ],
  //   });
  // }, []);

  return (
    <EndContext.Provider value={{ endLocation: end, setEndLocation: setEnd }}>
      <StartContext.Provider value={{ startLocation: start, setStartLocation: setStart }}>
        <DirectionsContext.Provider value={{ path, setPath }}>
          <div className="h-screen flex overflow-hidden">
            <Sidebar setSelectedFloor={setSelectedFloor} />
            <div className="flex-1 overflow-auto">
              <BeefletMap selectedFloor={selectedFloor}></BeefletMap>
            </div>
          </div>
        </DirectionsContext.Provider>
      </StartContext.Provider>
    </EndContext.Provider>
  );
};

export { Map };
