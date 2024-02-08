import { Autocomplete } from "@/components";

import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import {
  Sidebar as FlowbiteSidebar,
  Button,
  CustomFlowbiteTheme,
  Select,
  Label,
  List,
  Dropdown,
} from "flowbite-react";
import { CiMenuBurger, CiSearch } from "react-icons/ci";
import React, { useContext, useEffect, useState } from "react";
import { Nodes } from "database";
import { DirectionsContext } from "../components";

import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "h-full",
    collapsed: {
      off: "w-96",
    },
  },
  logo: {
    base: "",
    img: "",
  },
};

type SidebarProps = {
  setSelectedFloor: (value: string) => void;
};

const Sidebar = ({ setSelectedFloor }: SidebarProps) => {
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [directions, setDirections] = useState<string[]>([]);
  const [algorithm, setAlgorithm] = useState<string | null>("AStar");
  const newDirections = directions.map((ID) =>
    nodes.filter((node) => node["nodeID"] === ID),
  );

  const { path, setPath } = useContext(DirectionsContext);

  const locations: { nodeID: string; longName: string }[] = nodes.map(
    (node) => {
      return { nodeID: node.nodeID, longName: node.longName };
    },
  );

  const handleItemClick = (value: string) => {
    setAlgorithm(value);
  };

  function angleBetweenVectors(
    v1: { x: number; y: number },
    v2: { x: number; y: number },
  ): number {
    // Calculate the angle in radians using the arctangent function
    const angleRad = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);

    // Convert angle to degrees
    let angleDegrees = angleRad * (180 / Math.PI);

    // Adjust the angle to be in the range from -180 to 180 degrees
    if (angleDegrees > 180) {
      angleDegrees -= 360;
    } else if (angleDegrees < -180) {
      angleDegrees += 360;
    }

    return angleDegrees;
  }

  function turnDirection(index: number) {
    let currDirection = null;
    let prevDirection = null;
    let nextDirection = null;

    switch (index) {
      case 0:
        return "Start at ";
      case 1:
        return "Head towards ";
      case newDirections.length - 1:
        return "Arrive at ";
      default:
        if (
          newDirections.length > 0 &&
          index > 0 &&
          index < newDirections.length
        ) {
          prevDirection = newDirections[index - 1][0];
          currDirection = newDirections[index][0];
          nextDirection = newDirections[index + 1][0];

          if (currDirection && nextDirection && prevDirection) {
            const vector1 = {
              x: currDirection.xcoord - prevDirection.xcoord,
              y: currDirection.ycoord - prevDirection.ycoord,
            };
            const vector2 = {
              x: nextDirection.xcoord - currDirection.xcoord,
              y: nextDirection.ycoord - currDirection.ycoord,
            };

            const angle = angleBetweenVectors(vector1, vector2);

            // Use crossProductValue to determine left or right turn
            if (angle < -30) {
              return "Turn left towards ";
            } else if (angle >= -30 && angle < -15) {
              return "Bear left towards ";
            } else if (angle >= -15 && angle < 15) {
              return "Head straight towards ";
            } else if (angle >= 15 && angle < 30) {
              return "Bear right towards ";
            } else if (angle >= 30) {
              return "Turn right towards ";
            } else {
              return "idk lmfao";
            }
          }
        }
    }
  }

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
    fetchNodes();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startNodeId = nodes
      .filter((node) => node["longName"] === startLocation)
      .map((node) => node.nodeID)[0];
    const endNodeId = nodes
      .filter((node) => node["longName"] === endLocation)
      .map((node) => node.nodeID)[0];
    try {
      const res = await fetch("/api/map/pathfinding", {
        method: "POST",
        body: JSON.stringify({
          startNodeId,
          endNodeId,
          algorithm,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setDirections(data.path);
      console.log(newDirections);
      setPath(data.path);
      console.log(path);
      console.log(algorithm);
    } catch (error) {
      alert("Failed to find path. Please try again.");
    }
  };

  return (
    <FlowbiteSidebar aria-label="Map sidebar" theme={sidebarTheme}>
      <div className="flex space-x-4 items-center">
        <Button
          data-drawer-target={drawerId}
          data-drawer-show={drawerId}
          aria-controls={drawerId}
          outline
          label="Open navigation drawer"
        >
          <CiMenuBurger />
          <span className="sr-only">Open navigation drawer</span>
        </Button>
        <FlowbiteSidebar.Logo href="/" img={logoUrl} imgAlt="Hospital logo" />
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="mapFloor" value="Select a floor" />
          <Select
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
          </Select>
        </div>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <Autocomplete
            suggestions={startSuggestions}
            setSuggestions={setStartSuggestions}
            value={startLocation}
            setValue={setStartLocation}
            id="startLocation"
            htmlFor="startLocation"
            label="Enter starting point"
            placeholder="Medical Records Conference Room Floor L1"
            required
            rightIcon={CiSearch}
            onChange={(e) => {
              setStartLocation(e.target.value);
              if (e.target.value.length > 0) {
                setStartSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    )
                    .slice(0, 10),
                );
              } else {
                setStartSuggestions([]);
              }
            }}
          />
          <Autocomplete
            suggestions={endSuggestions}
            setSuggestions={setEndSuggestions}
            value={endLocation}
            setValue={setEndLocation}
            id="endLocation"
            htmlFor="endLocation"
            label="Enter destination"
            placeholder="Nuclear Medicine Floor L1"
            required
            rightIcon={CiSearch}
            onChange={(e) => {
              setEndLocation(e.target.value);
              if (e.target.value.length > 0) {
                setEndSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    )
                    .slice(0, 10),
                );
              } else {
                setEndSuggestions([]);
              }
            }}
          />
          <Dropdown
            label={`Search Method${algorithm ? `: ${algorithm}` : ""}`}
            dismissOnClick={true}
          >
            <Dropdown.Item onClick={() => handleItemClick("AStar")}>
              AStar
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleItemClick("BFS")}>
              BFS
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleItemClick("Dijkstra")}>
              Dijkstra
            </Dropdown.Item>
          </Dropdown>
          <Button type="submit">Submit</Button>
        </form>
        <List ordered>
          {newDirections.map((row, i: number) => (
            <List.Item key={i}>
              {i < newDirections.length && turnDirection(i)}
              {row[0]?.longName}{" "}
            </List.Item>
          ))}
        </List>
      </div>
    </FlowbiteSidebar>
  );
};

export { Sidebar };
