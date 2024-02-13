import { useState } from "react";
import firstFloor from "../assets/01_thefirstfloor.png";
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
  const [selectedFloor, setSelectedFloor] = useState(firstFloor);
  const [path, setPath] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  // const mapStyles = {
  //   width: "100%",
  //   height: "100vh",
  // };

  // useEffect(() => {
  //   L.map("beeflet", {
  //     center: [52, 4],
  //     zoom: 4,
  //     layers: [
  //       L.tileLayer(https://%7Bs%7D.tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png, {
  //         attribution:
  //           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //       }),
  //     ],
  //   });
  // }, []);

  return (
    <EndContext.Provider value={{ endLocation, setEndLocation }}>
      <StartContext.Provider value={{ startLocation, setStartLocation }}>
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
