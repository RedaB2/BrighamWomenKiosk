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
import { DirectionsContext, StartContext, EndContext } from "../components";

//import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";
import { Autocomplete } from "@/components";
import { HiChevronUp, HiChevronDown, HiLocationMarker } from "react-icons/hi";
//import { TbElevator } from "react-icons/tb";
import { MdElevator } from "react-icons/md";
import {
  BsArrowUpLeftCircle,
  BsArrowUpRightCircle,
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsArrowUpCircle,
} from "react-icons/bs";
/*
const customStyles = {
    li: {
        display: 'flex',
        alignItems: 'center',
    },
    '.custom-arrow-icon': {
        height: '1.5rem',
        width: '1.5rem',
        marginRight: '1.0rem !important',
    },
};
*/
const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "h-full",
    collapsed: {
      off: "w-80",
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

// A class to temporarily hold nodes with an associated floorID, so that nodes on separate areas of the same floor can be differentiated
class nodeFloorID {
  node: Nodes;
  floorID: string;

  constructor(node: Nodes, floorID: string) {
    this.node = node;
    this.floorID = floorID;
  }
}

const Sidebar = ({ setSelectedFloor }: SidebarProps) => {
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  //const [startLocation, setStartLocation] = useState<string>("");
  //const [endLocation, setEndLocation] = useState<string>("");
  const [directions, setDirections] = useState<string[]>([]);
  const [algorithm, setAlgorithm] = useState<string | null>("AStar");

  const [openFloor, setOpenFloor] = useState<string | null>(null);

  const newDirections = directions.map(
    (ID) => nodes.filter((node) => node["nodeID"] === ID)[0],
  );

  //assigns nodes IDs so that nodes on separate areas of the same floor can be differentiated
  function separateFloors(newDirections: Nodes[]) {
    let lastFloor = "";
    const floors: nodeFloorID[] = [];
    let floorID = 0;
    for (const node of newDirections) {
      if (lastFloor != node.floor) {
        lastFloor = node.floor;
        floorID = (floorID + 1) % 10;
      }
      floors.push(new nodeFloorID(node, node.floor + floorID));
    }
    return floors;
  }

  const splitDirections = separateFloors(newDirections);

  console.log(splitDirections);

  const { startLocation, setStartLocation } = useContext(StartContext);
  const { endLocation, setEndLocation } = useContext(EndContext);
  const { path, setPath } = useContext(DirectionsContext);

  path;
  const locations: { nodeID: string; longName: string }[] = nodes.map(
    (node) => {
      return { nodeID: node.nodeID, longName: node.longName };
    },
  );

  const handleItemClick = (value: string) => {
    setAlgorithm(value);
  };

  const handleFloorClick = (floorID: string) => {
    setOpenFloor((prevFloor) => (prevFloor === floorID ? null : floorID));
    const floor = floorID.substring(0, floorID.length - 1);
    if (floor == "L1") {
      setSelectedFloor(lowerLevel1);
    } else if (floor == "L2") {
      setSelectedFloor(lowerLevel2);
    } else if (floor == "1") {
      setSelectedFloor(firstFloor);
    } else if (floor == "2") {
      setSelectedFloor(secondFloor);
    } else if (floor == "3") {
      setSelectedFloor(thirdFloor);
    }
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

  function turnDirection(floor: string, index: number) {
    console.log(nodes);
    //const floor = floorID.substring(0,floorID.length-1);
    const floorDirections = splitDirections.filter(
      (direction, i, arr) =>
        direction?.floorID === floor ||
        (i > 0 && arr[i - 1].floorID === floor) ||
        (i === arr.length - 1 && arr[i].floorID === floor),
    );

    //console.log(floorDirections);

    const currDirection = floorDirections[index];
    const prevDirection = index > 0 ? floorDirections[index - 1] : null;
    const nextDirection =
      index < floorDirections.length - 1 ? floorDirections[index + 1] : null;

    if (nextDirection === null && index === floorDirections.length - 1) {
      // Assuming the next direction is already present in newDirections
      return (
        <>
          <HiLocationMarker className="mr-2 ml-1 h-5 w-5 inline" />
          {"Arrive at " + currDirection.node.longName}
        </>
      );
    }

    if (currDirection) {
      switch (index) {
        case 0:
          return (
            <>
              <HiLocationMarker className="mr-2 ml-1 h-5 w-5 inline" />
              {"Start at " + currDirection.node.longName}
            </>
          );
        case 1000:
          return (
            <>
              <BsArrowUpCircle className="mr-2 ml-1 w-4 h-4 inline " />
              {"Head towards " + currDirection.node.longName}
            </>
          );
        case newDirections.length - 1:
          return (
            <>
              {"Arrive at " + currDirection.node.longName}
              <HiLocationMarker
                className="mr-2 ml-1 h-4 w-4 inline "
                style={{ color: "blue" }}
              />
            </>
          );
        default:
          if (currDirection && nextDirection && prevDirection) {
            if (currDirection.floorID != nextDirection.floorID) {
              return (
                <>
                  <MdElevator className="mr-2 ml-1 h-5 w-5 inline" />
                  {"Take " +
                    currDirection.node.longName +
                    " to Floor " +
                    nextDirection.node.floor}
                </>
              );
            }

            const vector1 = {
              x: currDirection.node.xcoord - prevDirection.node.xcoord,
              y: currDirection.node.ycoord - prevDirection.node.ycoord,
            };
            const vector2 = {
              x: nextDirection.node.xcoord - currDirection.node.xcoord,
              y: nextDirection.node.ycoord - currDirection.node.ycoord,
            };

            const angle = angleBetweenVectors(vector1, vector2);
            // Use crossProductValue to determine left or right turn
            if (angle < -30) {
              return (
                <>
                  <BsArrowLeftCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Turn left towards " + currDirection.node.longName}
                </>
              );
            } else if (angle >= -30 && angle < -15) {
              return (
                <>
                  <BsArrowUpLeftCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Bear left towards " + currDirection.node.longName}
                </>
              );
            } else if (angle >= -15 && angle < 15) {
              return (
                <>
                  <BsArrowUpCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Continue Straight towards " + currDirection.node.longName}
                </>
              );
              //return "Head straight towards " + currDirection.longName;
            } else if (angle >= 15 && angle < 30) {
              return (
                <>
                  <BsArrowUpRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Bear right towards " + currDirection.node.longName}
                </>
              );
            } else if (angle >= 30) {
              return (
                <>
                  <BsArrowRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Turn right towards " + currDirection.node.longName}
                </>
              );
            } else {
              return "idk lmfao";
            }
          }
      }
    } else {
      return "Oh no! Something went wrong!";
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
      setPath(data.path);
    } catch (error) {
      alert("Failed to find path. Please try again.");
    }
  };

  function colorPicker(i: number, dark: number) {
    if (dark) {
      if (i % 2 == 0) {
        return "gray-700";
      }
      return "gray-800";
    }
    if (i % 2 == 0) {
      return "gray-50";
    }
    return "gray-200";
  }

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
            {
              //<option value={groundFloor}>Ground Floor</option>
            }
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
            onFocus={(e) => {
              setStartLocation(e.target.value);
              if (e.target.value.length > 0) {
                setStartSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2",
                    )
                    .sort()
                    .slice(0, 10),
                );
              } else {
                setStartSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2",
                    )
                    .sort(),
                );
              }
            }}
            onBlur={() => {
              setTimeout(() => setStartSuggestions([]), 200);
            }}
            onChange={(e) => {
              setStartLocation(e.target.value);
              if (e.target.value.length > 0) {
                setStartSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2",
                    )
                    .sort()
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
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2",
                    )
                    .sort()
                    .slice(0, 10),
                );
              } else {
                setEndSuggestions([]);
              }
            }}
            onFocus={(e) => {
              setEndLocation(e.target.value);
              if (e.target.value.length > 0) {
                setEndSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2",
                    )
                    .sort()
                    .slice(0, 10),
                );
              } else {
                setEndSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2",
                    )
                    .sort(),
                );
              }
            }}
            onBlur={() => {
              setTimeout(() => setEndSuggestions([]), 200);
            }}
          />
          <div className="w-full">
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
          </div>
          <Button type="submit">Submit</Button>
        </form>
        {/* Displaying directions organized by floor */}
        <div className="mt-4 space-y-2">
          {Array.from(
            new Set(splitDirections.map((direction) => direction?.floorID)),
          ).map((floor) => (
            <div key={floor}>
              <Button
                className="w-full"
                outline
                label={`Floor ${floor}`}
                onClick={() => handleFloorClick(floor)}
              >
                {openFloor === floor ? (
                  <>
                    {`Hide Directions for Floor ${floor.substring(0, floor.length - 1)}`}
                    <HiChevronUp className="ml-4 h-4 w-4" />
                  </>
                ) : (
                  <>
                    {`Show Directions for Floor ${floor.substring(0, floor.length - 1)}`}
                    <HiChevronDown className="ml-4 h-4 w-4" />
                  </>
                )}
              </Button>
              {openFloor === floor && (
                <List>
                  {splitDirections
                    .filter((direction) => direction?.floorID === floor)
                    .map((row, i: number) => (
                      <List
                        className={`bg-${colorPicker(i, 0)} dark:bg-${colorPicker(i, 1)}`}
                      >
                        {i < newDirections.length && turnDirection(floor, i)}
                      </List>
                    ))}
                </List>
              )}
            </div>
          ))}
        </div>
      </div>
    </FlowbiteSidebar>
  );
};

export { Sidebar };
