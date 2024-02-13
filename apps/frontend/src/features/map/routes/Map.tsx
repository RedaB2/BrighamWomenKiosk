import { useState } from "react";
import groundFloor from "../assets/00_thegroundfloor.png";
import { Sidebar, MapDisplay, DirectionsContext } from "../components";

//selectedFloor={selectedFloor}
const Map = () => {
  const [selectedFloor, setSelectedFloor] = useState(groundFloor);
  const [path, setPath] = useState<string[]>([]);

  return (
    <DirectionsContext.Provider value={{ path, setPath }}>
      <div className="h-screen flex overflow-hidden">
        <Sidebar setSelectedFloor={setSelectedFloor} />
        <div className="flex-1 overflow-auto">
          <MapDisplay selectedFloor={selectedFloor} />
        </div>
      </div>
    </DirectionsContext.Provider>
  );
};

export { Map };
