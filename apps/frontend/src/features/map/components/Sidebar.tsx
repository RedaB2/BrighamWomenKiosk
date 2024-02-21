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
import React, { useContext, useState } from "react";
import { Nodes } from "database";
import { MapContext } from "../components";

import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";
import { Autocomplete } from "@/components";
import { HiChevronDown, HiLocationMarker } from "react-icons/hi";
import { MdElevator } from "react-icons/md";
import {
  BsArrowUpLeftCircle,
  BsArrowUpRightCircle,
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsArrowUpCircle,
} from "react-icons/bs";
import { floorToAsset } from "../utils";

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

// A class to temporarily hold nodes with an associated floorID, so that nodes on separate areas of the same floor can be differentiated
class NodeFloorID {
  node: Nodes;
  floorID: string;

  constructor(node: Nodes, floorID: string) {
    this.node = node;
    this.floorID = floorID;
  }
}

const Sidebar = () => {
  const {
    nodes,
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
    setStartID,
    setEndID,
  } = useContext(MapContext);

  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [selectedFloorID, setSelectedFloorID] = useState("");

  let bgAlt = 0;

  const nodeDirections = path.map(
    (ID) => nodes.filter((node) => node["nodeID"] === ID)[0]
  );

  // assigns nodes IDs so that nodes on separate areas of the same floor can be differentiated
  function separateFloors(newDirections: Nodes[]) {
    let lastFloor = "";
    const floors: NodeFloorID[] = [];
    let floorID = 0;
    for (const node of newDirections) {
      if (lastFloor != node.floor) {
        lastFloor = node.floor;
        floorID = (floorID + 1) % 10;
      }
      floors.push(new NodeFloorID(node, node.floor + floorID));
    }
    return floors;
  }

  const splitDirections = separateFloors(nodeDirections);

  const handleFloorClick = (floorID: string) => {
    setSelectedFloor(adhocConverterChangePlease(floorID));
    setSelectedFloorID(floorID);
  };

  function turnDirection(floor: string, index: number) {
    bgAlt++;
    //const floor = floorID.substring(0,floorID.length-1);
    const floorDirections = splitDirections.filter(
      (direction, i, arr) =>
        direction?.floorID === floor ||
        (i > 0 && arr[i - 1].floorID === floor) ||
        (i === arr.length - 1 && arr[i].floorID === floor)
    );

    const currDirection = floorDirections[index];
    const prevDirection = index > 0 ? floorDirections[index - 1] : null;
    //const prevPrevDirection = index > 0 ? floorDirections[index - 2] : null;
    const nextDirection =
      index < floorDirections.length - 1 ? floorDirections[index + 1] : null;
    const nextNextDirection =
      index < floorDirections.length - 2 ? floorDirections[index + 2] : null;

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
            <div className="ml-3 mr-3">
              <HiLocationMarker className="mr-2 ml-1 h-5 w-5 inline" />
              {"Start at " + currDirection.node.longName}
            </div>
          );
        case 1000:
          return (
            <div className="ml-3 mr-3">
              <BsArrowUpCircle className="mr-2 ml-1 w-4 h-4 inline " />
              {"Head towards " + currDirection.node.longName}
            </div>
          );
        case nodeDirections.length - 1:
          return (
            <div className="ml-3 mr-3">
              {"Arrive at " + currDirection.node.longName}
              <HiLocationMarker
                className="mr-2 ml-1 h-4 w-4 inline "
                style={{ color: "blue" }}
              />
            </div>
          );
        default:
          if (currDirection && nextDirection && prevDirection) {
            if (currDirection.floorID != nextDirection.floorID) {
              return (
                <div className="ml-3 mr-3">
                  <MdElevator className="mr-2 ml-1 h-5 w-5 inline" />
                  {"Take " +
                    currDirection.node.longName +
                    " to Floor " +
                    nextDirection.node.floor}
                </div>
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
              if (nextNextDirection) {
                const vector3 = {
                  x: nextDirection.node.xcoord - currDirection.node.xcoord,
                  y: nextDirection.node.ycoord - currDirection.node.ycoord,
                };
                const vector4 = {
                  x: nextNextDirection.node.xcoord - nextDirection.node.xcoord,
                  y: nextNextDirection.node.ycoord - nextDirection.node.ycoord,
                };

                const angle2 = angleBetweenVectors(vector3, vector4);
                if (angle2 >= -15 && angle2 < 15) {
                  return (
                    <div className="ml-3 mr-3">
                      <BsArrowUpRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                      {"Turn left towards " + nextNextDirection.node.longName}
                    </div>
                  );
                }
              }
              return (
                <div className="ml-3 mr-3">
                  <BsArrowLeftCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Turn left towards " + nextDirection.node.longName}
                </div>
              );
            } else if (angle >= -30 && angle < -15) {
              if (nextNextDirection) {
                const vector3 = {
                  x: nextDirection.node.xcoord - currDirection.node.xcoord,
                  y: nextDirection.node.ycoord - currDirection.node.ycoord,
                };
                const vector4 = {
                  x: nextNextDirection.node.xcoord - nextDirection.node.xcoord,
                  y: nextNextDirection.node.ycoord - nextDirection.node.ycoord,
                };

                const angle2 = angleBetweenVectors(vector3, vector4);
                if (angle2 >= -15 && angle2 < 15) {
                  return (
                    <div className="ml-3 mr-3">
                      <BsArrowUpRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                      {"Bear left towards " + nextNextDirection.node.longName}
                    </div>
                  );
                }
              }
              return (
                <div className="ml-3 mr-3">
                  <BsArrowUpLeftCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Bear left towards " + nextDirection.node.longName}
                </div>
              );
            } else if (angle >= -15 && angle < 15) {
              if (nextNextDirection) {
                const vector3 = {
                  x: nextDirection.node.xcoord - currDirection.node.xcoord,
                  y: nextDirection.node.ycoord - currDirection.node.ycoord,
                };
                const vector4 = {
                  x: nextNextDirection.node.xcoord - nextDirection.node.xcoord,
                  y: nextNextDirection.node.ycoord - nextDirection.node.ycoord,
                };

                const angle2 = angleBetweenVectors(vector3, vector4);
                if (angle2 >= -15 && angle2 < 15) {
                  bgAlt--;
                  return;
                }
              }
              return (
                <div className="ml-3 mr-3">
                  <BsArrowUpCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Continue Straight towards " + nextDirection.node.longName}
                </div>
              );
              //return "Head straight towards " + currDirection.longName;
            } else if (angle >= 15 && angle < 30) {
              if (nextNextDirection) {
                const vector3 = {
                  x: nextDirection.node.xcoord - currDirection.node.xcoord,
                  y: nextDirection.node.ycoord - currDirection.node.ycoord,
                };
                const vector4 = {
                  x: nextNextDirection.node.xcoord - nextDirection.node.xcoord,
                  y: nextNextDirection.node.ycoord - nextDirection.node.ycoord,
                };

                const angle2 = angleBetweenVectors(vector3, vector4);
                if (angle2 >= -15 && angle2 < 15) {
                  return (
                    <div className="ml-3 mr-3">
                      <BsArrowUpRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                      {"Bear right towards " + nextNextDirection.node.longName}
                    </div>
                  );
                }
              }
              return (
                <div className="ml-3 mr-3">
                  <BsArrowUpRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Bear right towards " + nextDirection.node.longName}
                </div>
              );
            } else if (angle >= 30) {
              if (nextNextDirection) {
                const vector3 = {
                  x: nextDirection.node.xcoord - currDirection.node.xcoord,
                  y: nextDirection.node.ycoord - currDirection.node.ycoord,
                };
                const vector4 = {
                  x: nextNextDirection.node.xcoord - nextDirection.node.xcoord,
                  y: nextNextDirection.node.ycoord - nextDirection.node.ycoord,
                };

                const angle2 = angleBetweenVectors(vector3, vector4);
                if (angle2 >= -15 && angle2 < 15) {
                  return (
                    <div className="ml-3 mr-3">
                      <BsArrowUpRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                      {"Turn right towards " + nextNextDirection.node.longName}
                    </div>
                  );
                }
              }
              return (
                <div className="ml-3 mr-3">
                  <BsArrowRightCircle className="mr-2 ml-1 w-4 h-4 inline" />
                  {"Turn right towards " + nextDirection.node.longName}
                </div>
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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    bgAlt = 0;
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
      // setDirections(data.path);
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

  setStartID(
    nodes
      .filter((node) => node["longName"] === startLocation)
      .map((node) => node.nodeID)[0]
  );
  setEndID(
    nodes
      .filter((node) => node["longName"] === endLocation)
      .map((node) => node.nodeID)[0]
  );

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

      <div className="flex flex-col space-y-4 my-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="mapFloor" value="Select a floor" />
          <Select
            className="w-full"
            name="mapFloor"
            id="mapFloor"
            onChange={(e) => setSelectedFloor(e.target.value)}
            value={selectedFloor}
          >
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
              setStartID(
                nodes
                  .filter((node) => node["longName"] === startLocation)
                  .map((node) => node.nodeID)[0]
              );
              if (e.target.value.length > 0) {
                setStartSuggestions(
                  nodes
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2"
                    )
                    .sort()
                    .slice(0, 10)
                );
              } else {
                setStartSuggestions(
                  nodes
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2"
                    )
                    .sort()
                );
              }
            }}
            onBlur={() => {
              setStartID(
                nodes
                  .filter((node) => node["longName"] === startLocation)
                  .map((node) => node.nodeID)[0]
              );
              setTimeout(() => setStartSuggestions([]), 200);
            }}
            onChange={(e) => {
              setStartLocation(e.target.value);
              setStartID(
                nodes
                  .filter((node) => node["longName"] === startLocation)
                  .map((node) => node.nodeID)[0]
              );
              if (e.target.value.length > 0) {
                setStartSuggestions(
                  nodes
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2"
                    )
                    .sort()
                    .slice(0, 10)
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
              setEndID(
                nodes
                  .filter((node) => node["longName"] === endLocation)
                  .map((node) => node.nodeID)[0]
              );
              if (e.target.value.length > 0) {
                setEndSuggestions(
                  nodes
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2"
                    )
                    .sort()
                    .slice(0, 10)
                );
              } else {
                setEndSuggestions([]);
              }
            }}
            onFocus={(e) => {
              setEndLocation(e.target.value);
              setEndID(
                nodes
                  .filter((node) => node["longName"] === endLocation)
                  .map((node) => node.nodeID)[0]
              );
              if (e.target.value.length > 0) {
                setEndSuggestions(
                  nodes
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2"
                    )
                    .sort()
                    .slice(0, 10)
                );
              } else {
                setEndSuggestions(
                  nodes
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    .filter(
                      (loc) =>
                        (!loc.toLowerCase().includes("hall") &&
                          !loc.toLowerCase().includes("stair") &&
                          !loc.toLowerCase().includes("elevator")) ||
                        loc.toLowerCase() ===
                          "carrie m. hall conference center floor 2"
                    )
                    .sort()
                );
              }
            }}
            onBlur={() => {
              setTimeout(() => setEndSuggestions([]), 200);
            }}
          />
          <Dropdown
            label={`Search Method${algorithm ? `: ${algorithm}` : ""}`}
            size="xs"
            dismissOnClick={true}
          >
            <Dropdown.Item onClick={() => setAlgorithm("AStar")}>
              AStar
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setAlgorithm("BFS")}>
              BFS
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setAlgorithm("DFS")}>
              DFS
            </Dropdown.Item>
          </Dropdown>
          <Button type="submit">Submit</Button>
        </form>
        {/* Displaying directions organized by floor */}
        <div className="mt-4 space-y-2">
          {Array.from(
            new Set(splitDirections.map((direction) => direction?.floorID))
          ).map((floorID) => (
            <div key={floorID}>
              <Button
                className="w-full"
                outline
                label={`Floor ${floorID}`}
                onClick={() => handleFloorClick(floorID)}
              >
                {selectedFloorID === floorID ? (
                  <>
                    {`Directions for Floor ${floorID.substring(
                      0,
                      floorID.length - 1
                    )}:`}
                  </>
                ) : (
                  <>
                    {`Show Directions for Floor ${floorID.substring(
                      0,
                      floorID.length - 1
                    )}`}
                    <HiChevronDown className="ml-4 h-4 w-4" />
                  </>
                )}
              </Button>
              {selectedFloorID === floorID && (
                <List key={floorID}>
                  {splitDirections
                    .filter((direction) => direction?.floorID === floorID)
                    .map((row, i: number) => (
                      <List
                        key={i}
                        className={`bg-${colorPicker(
                          bgAlt,
                          0
                        )} dark:bg-${colorPicker(bgAlt, 1)}`}
                      >
                        {i < nodeDirections.length && turnDirection(floorID, i)}
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

const adhocConverterChangePlease = (floorID: string) => {
  const floor = floorID.substring(0, floorID.length - 1);
  // @ts-expect-error nope
  return floorToAsset(floor);
};

function angleBetweenVectors(
  v1: { x: number; y: number },
  v2: { x: number; y: number }
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

export { Sidebar };
