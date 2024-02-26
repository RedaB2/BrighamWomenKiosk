import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import {
  Sidebar as FlowbiteSidebar,
  Button,
  CustomFlowbiteTheme,
  Label,
  List,
  Dropdown,
} from "flowbite-react";
import { CiMenuBurger, CiSearch } from "react-icons/ci";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nodes } from "database";
import { MapContext } from "../components";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";
import { Autocomplete } from "@/components";
import { HiChevronUp, HiChevronDown, HiLocationMarker } from "react-icons/hi";
import { MdElevator, MdStairs } from "react-icons/md";
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
export class NodeFloorID {
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
    floorSections,
    setFloorSections,
    selectedFID,
    setSelectedFID,
    setCenter,
  } = useContext(MapContext);

  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [splitDirections, setSplitDirections] = useState<NodeFloorID[]>([]);

  let bgAlt = 0;

  // assigns nodes IDs so that nodes on separate areas of the same floor can be differentiated

  function chooseFID(floor: string): string {
    if (!floorSections[0]) {
      return "";
    }
    for (const anFID in floorSections) {
      if (anFID.substring(0, anFID.length - 1) == floor) {
        return anFID;
      }
    }
    return floorSections[0].floorID;
  }

  useEffect(() => {
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

    const nodeDirections = path.map(
      (ID) => nodes.filter((node) => node["nodeID"] === ID)[0]
    );

    setSplitDirections(separateFloors(nodeDirections));
  }, [path, nodes]);

  useEffect(() => {
    // Set to store unique floorID values
    const uniqueFloorIDSet = new Set<string>();

    setFloorSections(
      splitDirections.filter((item) => {
        // Check if the 'type' is not in the Set
        if (!uniqueFloorIDSet.has(item.floorID)) {
          // Add the 'type' to the Set and return the item
          uniqueFloorIDSet.add(item.floorID);
          return true;
        }
        // If the 'type' is already in the Set, return undefined (filtered out)
        return false;
      })
    );
    setSelectedFID(
      splitDirections[0] ? splitDirections[0].floorID : chooseFID("")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitDirections]);

  useEffect(() => {
    if (selectedFID === "") {
      return;
    }
    if (!openFloors.includes(selectedFID)) {
      // If not open, add it to the open floors
      setOpenFloors([selectedFID]);
      setSelectedFloor(adhocConverterChangePlease(selectedFID));
      const floorDirections = splitDirections.filter(
        (direction, i, arr) =>
          direction?.floorID === selectedFID ||
          (i > 0 && arr[i - 1].floorID === selectedFID) ||
          (i === arr.length - 1 && arr[i].floorID === selectedFID)
      );
      let maxX = 0.1;
      let maxY = 0.1;
      let minX = 0.1;
      let minY = 0.1;
      for (const aNode of floorDirections) {
        if (maxX % 1 != 0) {
          maxX = aNode.node.xcoord;
        }
        if (maxY % 1 != 0) {
          maxY = aNode.node.ycoord;
        }
        if (minX % 1 != 0) {
          minX = aNode.node.xcoord;
        }
        if (minY % 1 != 0) {
          minY = aNode.node.ycoord;
        }
        if (aNode.node.xcoord > maxX) {
          maxX = aNode.node.xcoord;
        }
        if (aNode.node.ycoord > maxY) {
          maxY = aNode.node.ycoord;
        }
        if (aNode.node.xcoord < minX) {
          minX = aNode.node.xcoord;
        }
        if (aNode.node.ycoord < minY) {
          minY = aNode.node.ycoord;
        }
      }
      setCenter([
        minX + (maxX - minX) / 2,
        minY + (maxY - minY) / 2,
        -0.00035 * Math.sqrt((maxX - minX) ** 2 + (maxY - minY) ** 2),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFID]);

  const [openFloors, setOpenFloors] = useState<string[]>([]);

  const handleFloorClick = (floorID: string) => {
    // Check if the floor is already open
    if (openFloors.includes(floorID)) {
      // If open, close the floor
      setOpenFloors((prevOpenFloors) =>
        prevOpenFloors.filter((openFloor) => openFloor !== floorID)
      );
    } else {
      // If not open, add it to the open floors
      setOpenFloors((prevOpenFloors) => [...prevOpenFloors, floorID]);
      setSelectedFloor(adhocConverterChangePlease(floorID));
      setSelectedFID(floorID);
    }
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
        case splitDirections.length - 1:
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
                  {currDirection.node.nodeType == "ELEV" ? (
                    <MdElevator className="mr-2 ml-1 h-5 w-5 inline" />
                  ) : (
                    <MdStairs className="mr-2 ml-1 h-5 w-5 inline" />
                  )}
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
            if (angle < -35) {
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
                if (angle2 >= -20 && angle2 < 20) {
                  return (
                    <div className="ml-3 mr-3">
                      <BsArrowUpCircle className="mr-2 ml-1 w-4 h-4 inline" />
                      {"Head straight towards " +
                        nextNextDirection.node.longName}
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
            } else if (angle >= -35 && angle < -20) {
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
            } else if (angle >= -20 && angle < 20) {
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
                if (angle2 >= -20 && angle2 < 20) {
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
            } else if (angle >= 20 && angle < 35) {
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
                if (angle2 >= -20 && angle2 < 20) {
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
            } else if (angle >= 35) {
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
                if (angle2 >= -20 && angle2 < 20) {
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

  useEffect(() => {
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
  }, [endLocation, nodes, setEndID, setStartID, startLocation]);

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
        <Link to="/" className="h-full flex-1 flex justify-center items-center">
          <img src={logoUrl} alt="Hospital logo" />
        </Link>
      </div>

      <div className="flex flex-col space-y-4 my-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="mapFloor" value="Select a floor" />
          <div className={"w-full"}>
            <Button.Group className="w-full flex justify-center">
              <Button
                onClick={() => {
                  setSelectedFloor(lowerLevel2);
                  setSelectedFID(chooseFID("L2"));
                }}
                color={selectedFloor === lowerLevel2 ? undefined : "gray"}
                className={"w-1/5 focus:ring-2"}
              >
                L2
              </Button>
              <Button
                onClick={() => {
                  setSelectedFloor(lowerLevel1);
                  setSelectedFID(chooseFID("L1"));
                }}
                color={selectedFloor === lowerLevel1 ? undefined : "gray"}
                className={"w-1/5 focus:ring-2"}
              >
                L1
              </Button>
              <Button
                onClick={() => {
                  setSelectedFloor(firstFloor);
                  setSelectedFID(chooseFID("1"));
                }}
                color={selectedFloor === firstFloor ? undefined : "gray"}
                className={"w-1/5 focus:ring-2"}
              >
                1
              </Button>
              <Button
                onClick={() => {
                  setSelectedFloor(secondFloor);
                  setSelectedFID(chooseFID("2"));
                }}
                color={selectedFloor === secondFloor ? undefined : "gray"}
                className={"w-1/5 focus:ring-2"}
              >
                2
              </Button>
              <Button
                onClick={() => {
                  setSelectedFloor(thirdFloor);
                  setSelectedFID(chooseFID("3"));
                }}
                color={selectedFloor === thirdFloor ? undefined : "gray"}
                className={"w-1/5 focus:ring-2"}
              >
                3
              </Button>
            </Button.Group>
          </div>
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
            <Dropdown.Item onClick={() => setAlgorithm("Dijkstra")}>
              Dijkstra
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
                onClick={() => {
                  handleFloorClick(floorID);
                  setSelectedFID(floorID);
                }}
              >
                {openFloors.includes(floorID) ? (
                  <>
                    {`Hide Directions for Floor ${floorID.substring(
                      0,
                      floorID.length - 1
                    )}`}
                    <HiChevronUp className="ml-4 h-4 w-4" />
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
              {openFloors.includes(floorID) && (
                <List key={floorID}>
                  {splitDirections
                    .filter((direction) => direction?.floorID === floorID)
                    .map((row, i: number) => (
                      <div
                        key={i}
                        className={`bg-${colorPicker(
                          bgAlt,
                          0
                        )} dark:bg-${colorPicker(bgAlt, 1)} text-left w-full`}
                        role="button"
                        aria-label="direction"
                        tabIndex={0}
                        onClick={() => {
                          const floorDirections = splitDirections.filter(
                            (direction, i, arr) =>
                              direction?.floorID === floorID ||
                              (i > 0 && arr[i - 1].floorID === floorID) ||
                              (i === arr.length - 1 &&
                                arr[i].floorID === floorID)
                          );

                          const currDirection = floorDirections[i];
                          setCenter([
                            currDirection.node.xcoord,
                            currDirection.node.ycoord,
                            1,
                          ]);
                          setSelectedFloor(adhocConverterChangePlease(floorID));
                        }}
                      >
                        {i < splitDirections.length &&
                          turnDirection(floorID, i)}
                      </div>
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
  if (floorID) {
    if (floorID.length > 3) {
      return floorID;
    }
    const floor = floorID.substring(0, floorID.length - 1);
    // @ts-expect-error nope
    return floorToAsset(floor);
  }
  return floorToAsset("1");
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
