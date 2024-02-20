import { useContext, useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  Circle,
  Polyline,
  Popup,
  FeatureGroup,
  Marker,
  LayerGroup,
  Tooltip,
  SVGOverlay,
} from "react-leaflet";
import L, { LatLngBounds, CRS } from "leaflet";
import { MapContext } from "../components";
import "./forBeef.css";
import "leaflet/dist/leaflet.css";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/features/map/components/Description.tsx";
import { assetToFloor, floorToAsset } from "../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { Nodes } from "database";
import ElevatorIcon from "../assets/ElevatorIcon.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

lowerLevel1;
lowerLevel2;
firstFloor;
secondFloor;
thirdFloor;

export default function BeefletMap() {
  // Define the bounds of the image in terms of x and y coordinates
  const imageBounds = new LatLngBounds([0, 0], [-3400, 5000]);
  const {
    nodes,
    edges,
    algorithm,
    selectedFloor,
    setSelectedFloor,
    path,
    setPath,
    //startLocation,
    setStartLocation,
    //endLocation,
    setEndLocation,
  } = useContext(MapContext);

  const [toggledEdges, setToggledEdges] = useState(false);
  const [toggledNames, setToggledNames] = useState(false);
  const [toggledHallways, setToggledHallways] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [startID, setStartID] = useState("");
  const [endID, setEndID] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const nodePath = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID),
  );

  class newNodeFloorID {
    node: Nodes;
    floorID: string;

    constructor(node: Nodes, floorID: string) {
      this.node = node;
      this.floorID = floorID;
    }
  }

  let paths = { G: [], L1: [], L2: [], "1": [], "2": [], "3": [] };

  const floorChanges: newNodeFloorID[] = [];
  const prevFloors: newNodeFloorID[] = [];

  if (nodePath.length > 0) {
    paths = { G: [], L1: [], L2: [], "1": [], "2": [], "3": [] };
    let currentFloor = nodePath[0][0].floor;
    let lastCut = 0;
    for (let i = 1; i < nodePath.length; i++) {
      if (nodePath[i][0].floor != currentFloor) {
        // @ts-expect-error type error (any)
        paths[currentFloor].push(nodePath.slice(lastCut, i));
        currentFloor = nodePath[i][0].floor;
        lastCut = i;
        floorChanges.push(new newNodeFloorID(nodePath[i - 1][0], currentFloor));
        prevFloors.push(
          new newNodeFloorID(nodePath[i][0], nodePath[i - 1][0].floor),
        );
      }
    }
    // @ts-expect-error type error (any)
    paths[currentFloor].push(nodePath.slice(lastCut, nodePath.length));
  }

  const handleSubmit = async (s: string, e: string) => {
    if (s === "" || e === "") {
      return;
    }
    const startNodeId = nodes
      .filter((node) => node["nodeID"] === s)
      .map((node) => node.nodeID)[0];
    const endNodeId = nodes
      .filter((node) => node["nodeID"] === e)
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
      //setDirections(data.path);
      setPath(data.path);
    } catch (error) {
      alert("Failed to find path. Please try again.");
    }
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        style={{ width: "100%", height: "100vh" }}
        center={[-1700, 2500]} // Center of the image in x and y coordinates
        zoom={-2}
        crs={CRS.Simple} // Use the simple CRS for x and y coordinates
        minZoom={-3} // Adjust as needed
        maxZoom={3} // Adjust as needed
        maxBoundsViscosity={1.0}
        bounceAtZoomLimits={true}
        doubleClickZoom={false}
      >
        <LayerGroup>
          <ImageOverlay url={selectedFloor} bounds={imageBounds} />
          {toggledEdges &&
            edges
              .map((edge) => [
                nodes.filter((node) => node.nodeID == edge.startNode),
                nodes.filter((node) => node.nodeID == edge.endNode),
              ])
              .filter(
                (edge) =>
                  edge[0][0].floor == assetToFloor(selectedFloor) &&
                  edge[0][0].floor == edge[1][0].floor,
              )
              .map((edge) => (
                <Polyline
                  positions={[
                    [edge[0][0].ycoord * -1, edge[0][0].xcoord],
                    [edge[1][0].ycoord * -1, edge[1][0].xcoord],
                  ]}
                ></Polyline>
              ))}
          {paths[assetToFloor(selectedFloor)].map((currentPath, i) => (
            <Polyline
              key={i}
              //@ts-expect-error any type error
              positions={currentPath.map((node) => [
                -node[0].ycoord,
                node[0].xcoord,
              ])}
              pathOptions={{ color: "black" }}
              interactive={false}
              weight={8}
            />
          ))}
        </LayerGroup>
        <SVGOverlay bounds={imageBounds}></SVGOverlay>
        <FeatureGroup>
          {nodes
            .filter((node) => node.floor == assetToFloor(selectedFloor))
            .filter((node) => {
              if (toggledHallways) {
                return true;
              }
              return node.nodeType != "HALL";
            })
            .map((node, i) => {
              return (
                <Circle
                  key={i}
                  center={[-node.ycoord, node.xcoord]}
                  radius={(() => {
                    if (node.nodeID == startID) {
                      return 10;
                    } else if (node.nodeID == endID) {
                      return 10;
                    }
                    return 7;
                  })()}
                  pathOptions={{
                    color: (() => {
                      if (node.nodeID == startID) {
                        return "blue";
                      } else if (node.nodeID == endID) {
                        return "red";
                      }
                      return "green";
                    })(),
                  }}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                      setClicked(false);
                    },
                    mouseout: (e) => {
                      if (clicked) {
                        return;
                      }
                      e.target.closePopup();
                    },
                    click: async (e) => {
                      if (clicked || e.originalEvent.ctrlKey) {
                        e.target.closePopup();
                        setStartLocation(node.longName);
                        setStartID(node.nodeID);
                        await handleSubmit(node.nodeID, endID);
                        return;
                      }
                      setClicked(true);
                    },
                    contextmenu: async (e) => {
                      //e.target.preventDefault();
                      e.target.closePopup();
                      setEndLocation(node.longName);
                      setEndID(node.nodeID);
                      await handleSubmit(startID, node.nodeID);
                    },
                  }}
                  fillOpacity={0.8}
                >
                  <Popup className="leaflet-popup-content-wrapper">
                    {clicked ? (
                      <div className={"flex flex-col space-y-2"}>
                        <Button
                          onClick={async () => {
                            setStartLocation(node.longName);
                            setStartID(node.nodeID);
                            await handleSubmit(node.nodeID, endID);
                          }}
                          className={"custom-button"}
                        >
                          Set Start
                        </Button>
                        <Button
                          onClick={async () => {
                            setEndLocation(node.longName);
                            setEndID(node.nodeID);
                            await handleSubmit(startID, node.nodeID);
                          }}
                          className={"custom-button"}
                        >
                          Set End
                        </Button>
                        {isAuthenticated && (
                          <Button
                            className={"custom-button"}
                            onClick={() => navigate("/data/services")}
                          >
                            View Requests
                          </Button>
                        )}
                        {isAuthenticated && (
                          <Button
                            className={"custom-button"}
                            onClick={() => navigate("/services")}
                          >
                            Make Request
                          </Button>
                        )}
                        {isAuthenticated && (
                          <Button className={"custom-button"}>
                            Schedule Move
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        {"Full name: " + node.longName}
                        <br />
                        {"Short name: " + node.shortName}
                        <br />
                        {"Node ID: " + node.nodeID}
                      </div>
                    )}
                  </Popup>
                  {toggledNames && (
                    <Tooltip
                      permanent={true}
                      className={"customTooltip"}
                      direction={"top"}
                    >
                      {node.longName}
                    </Tooltip>
                  )}
                </Circle>
              );
            })}
        </FeatureGroup>
        {nodes
          .filter(
            (node) =>
              node.nodeID == startID &&
              node.floor == assetToFloor(selectedFloor),
          )
          .map((node) => (
            <Marker position={[-node.ycoord, node.xcoord]} key={node.nodeID} />
          ))}
        {nodes
          .filter(
            (node) =>
              node.nodeID == endID && node.floor == assetToFloor(selectedFloor),
          )
          .map((node) => (
            <Marker position={[-node.ycoord, node.xcoord]} key={node.nodeID} />
          ))}
        {floorChanges
          .filter(
            (newFloor) => newFloor.node.floor == assetToFloor(selectedFloor),
          )
          .map((newFloor) => (
            <Marker
              position={[-newFloor.node.ycoord, newFloor.node.xcoord]}
              key={newFloor.node.nodeID}
              icon={L.icon({
                iconUrl: ElevatorIcon,
                iconSize: [20, 20], // Adjust size if needed
                iconAnchor: [10, 10],
                tooltipAnchor: [0, -10],
              })}
              eventHandlers={{
                click: async () =>
                  setSelectedFloor(
                    adhocConverterChangePlease(newFloor.floorID),
                  ),
              }}
            >
              <Tooltip
                permanent={true}
                className={"customTooltip"}
                direction={"top"}
              >
                {"Proceed to Floor " + newFloor.floorID}
              </Tooltip>
            </Marker>
          ))}
        {prevFloors
          .filter(
            (newFloor) => newFloor.node.floor == assetToFloor(selectedFloor),
          )
          .map((newFloor) => (
            <Marker
              position={[-newFloor.node.ycoord, newFloor.node.xcoord]}
              key={newFloor.node.nodeID}
              icon={L.icon({
                iconUrl: ElevatorIcon,
                iconSize: [20, 20], // Adjust size if needed
                iconAnchor: [10, 10],
                tooltipAnchor: [0, -10],
              })}
              eventHandlers={{
                click: async () =>
                  setSelectedFloor(
                    adhocConverterChangePlease(newFloor.floorID),
                  ),
              }}
            >
              <Tooltip
                permanent={true}
                className={"customTooltip"}
                direction={"top"}
              >
                {"Arrive from Floor " + newFloor.floorID}
              </Tooltip>
            </Marker>
          ))}
        <div>
          <CustomButton
            title={"Toggle Edges"}
            onClick={() => setToggledEdges(!toggledEdges)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
          <CustomButton
            title={"Toggle Names"}
            onClick={() => setToggledNames(!toggledNames)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
          <CustomButton
            title={"Toggle Hallways"}
            onClick={() => setToggledHallways(!toggledHallways)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
        </div>
      </MapContainer>
    </div>
  );
}

const adhocConverterChangePlease = (floorID: string) => {
  //const floor = floorID.substring(0, floorID.length - 1);
  // @ts-expect-error nope
  return floorToAsset(floorID);
};
