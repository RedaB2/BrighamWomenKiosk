import { useEffect, useState } from "react";
import firstFloor from "../assets/01_thefirstfloor.png";
import { Sidebar, MapContext } from "../components";
import BeefletMap from "@/features/map/components/BeefletMap.tsx";
import { Edges, Nodes } from "database";

const Map = () => {
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [edges, setEdges] = useState<Edges[]>([]);
  const [selectedFloor, setSelectedFloor] = useState(firstFloor);
  const [path, setPath] = useState<string[]>([]);
  const [algorithm, setAlgorithm] = useState<string>("AStar");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [startID, setStartID] = useState("");
  const [endID, setEndID] = useState("");

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch("/api/map/nodes");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setNodes(data);
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      }
    };
    const fetchEdges = async () => {
      try {
        const res = await fetch("/api/map/edges");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setEdges(data);
      } catch (error) {
        console.error("Failed to fetch edges:", error);
      }
    };
    fetchNodes();
    fetchEdges();
  }, []);

  return (
    <MapContext.Provider
      value={{
        nodes,
        setNodes,
        edges,
        setEdges,
        selectedFloor,
        setSelectedFloor,
        algorithm,
        setAlgorithm,
        path,
        setPath,
        startLocation,
        setStartLocation,
        endLocation,
        setEndLocation,
        startID,
        setStartID,
        endID,
        setEndID,
      }}
    >
      <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-neutral-900">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <BeefletMap />
        </div>
      </div>
    </MapContext.Provider>
  );
};

export { Map };
