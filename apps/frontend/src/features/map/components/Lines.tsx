import { useContext, useState } from "react";
import { MapContext } from "../components";
import { Nodes } from "database";

import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

function Lines(props: {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
  selectedFloor: string;
}) {
  const { nodes, edges, path } = useContext(MapContext);
  const path2 = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID),
  );
  const [displayV, setdisplayV] = useState(false);

  const floorID = () => {
    if (props.selectedFloor == groundFloor) {
      return "G";
    } else if (props.selectedFloor == lowerLevel1) {
      return "L1";
    } else if (props.selectedFloor == lowerLevel2) {
      return "L2";
    } else if (props.selectedFloor == firstFloor) {
      return "1";
    } else if (props.selectedFloor == secondFloor) {
      return "2";
    } else if (props.selectedFloor == thirdFloor) {
      return "3";
    }
    return "";
  };

  let paths = { G: [], L1: [], L2: [], "1": [], "2": [], "3": [] };

  if (path2.length > 0) {
    paths = { G: [], L1: [], L2: [], "1": [], "2": [], "3": [] };
    let currentFloor = path2[0][0].floor;
    let lastCut = 0;
    for (let i = 1; i < path2.length; i++) {
      if (path2[i][0].floor != currentFloor) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        paths[currentFloor].push(path2.slice(lastCut, i));
        currentFloor = path2[i][0].floor;
        lastCut = i;
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    paths[currentFloor].push(path2.slice(lastCut, path2.length));
  }

  function stylePost(c: number, d: string) {
    if (d == "x") {
      return ((c / 5000) * (props.right - props.left)).toString();
    } else {
      return ((c / 3400) * (props.bottom - props.top)).toString();
    }
  }

  function pathToPoints(path: Nodes[][]): {
    pathData: string;
    pathLength: number;
  } {
    let pathData =
      "M" +
      stylePost(path[0][0].xcoord, "x") +
      "," +
      stylePost(path[0][0].ycoord, "y") +
      " ";
    path.slice(1, path.length).forEach((node) => {
      pathData +=
        "L" +
        (stylePost(node[0].xcoord, "x") +
          "," +
          stylePost(node[0].ycoord, "y") +
          " ");
    });

    const pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    pathElement.setAttribute("d", pathData);

    const pathLength = pathElement.getTotalLength();

    return { pathData, pathLength };
  }

  return (
    <>
      <svg
        width={props.width}
        height={props.height}
        xmlns="http://www.w3.org/2000/svg"
      >
        {floorID() != "G" &&
          displayV &&
          edges
            .map((edge) => [
              nodes.filter((node) => node.nodeID == edge.startNode),
              nodes.filter((node) => node.nodeID == edge.endNode),
            ])
            .filter(
              (edge) =>
                edge[0][0].floor == floorID() &&
                edge[0][0].floor == edge[1][0].floor,
            )
            .map((edge, i) => (
              <line
                key={i}
                x1={stylePost(edge[0][0].xcoord, "x")}
                x2={stylePost(edge[1][0].xcoord, "x")}
                y1={stylePost(edge[0][0].ycoord, "y")}
                y2={stylePost(edge[1][0].ycoord, "y")}
                stroke="blue"
              />
            ))}
        {
          // @ts-expect-error type error
          paths[floorID()].length > 0 &&
            // @ts-expect-error type error
            paths[floorID()].map((currentPath, i) => (
              <g key={i}>
                <path
                  id={"movePath" + i.toString()}
                  d={pathToPoints(currentPath).pathData}
                  stroke="green"
                  fill="none"
                  strokeWidth={1}
                />
                {(() => {
                  const pathLength = pathToPoints(currentPath).pathLength;
                  const numDots = Math.floor(pathLength / 1.5);
                  return [...Array(numDots)].map((_, index) => (
                    <>
                      <circle key={index} r={0.5} fill="yellow">
                        <animateMotion
                          dur={10}
                          repeatCount="indefinite"
                          begin={index * 0.5}
                          path={pathToPoints(currentPath).pathData}
                        ></animateMotion>
                      </circle>
                    </>
                  ));
                })()}
              </g>
            ))
        }
        {nodes
          .filter((Node) => Node.floor == floorID())
          .map((node, i) => (
            <circle
              key={i}
              r={0.5}
              cy={stylePost(node.ycoord, "y")}
              cx={stylePost(node.xcoord, "x")}
              stroke={"black"}
              onClick={() => alert(node.longName)}
            />
          ))}
      </svg>
      <button onClick={() => setdisplayV(!displayV)}>Display Toggle</button>
    </>
  );
}

export { Lines };