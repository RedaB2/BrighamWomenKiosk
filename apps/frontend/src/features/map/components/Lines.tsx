import { useContext, useEffect, useState } from "react";
import { DirectionsContext } from "../components";
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
  const { path } = useContext(DirectionsContext);
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const path2 = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID)
  );

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

  function stylePost(c: number, d: string) {
    if (d == "x") {
      return ((c / 5000) * (props.right - props.left)).toString();
    } else {
      return ((c / 3400) * (props.bottom - props.top)).toString();
    }
  }

  function pathToPoints(path: Nodes[][]) {
    let pathPoints =
      "M" +
      stylePost(path[0][0].xcoord, "x") +
      "," +
      stylePost(path[0][0].ycoord, "y") +
      " ";
    path.slice(1, path.length).map((node) => {
      pathPoints +=
        "L" +
        (stylePost(node[0].xcoord, "x") +
          "," +
          stylePost(node[0].ycoord, "y") +
          " ");
    });
    return pathPoints;
  }

  return (
    <>
      <svg
        width={props.width}
        height={props.height}
        xmlns="http://www.w3.org/2000/svg"
      >
        {
          //@ts-expect-error error typing
          paths[floorID()].length > 0 &&
            //@ts-expect-error error typing
            paths[floorID()].map((currentPath, i) => (
              <path
                id={"movePath" + i.toString()}
                d={pathToPoints(currentPath)}
                stroke="green"
                fill="none"
                strokeWidth={1}
              />
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
    </>
  );
}

/*
{paths[floorID()].length > 0 && (paths[floorID()].map((currentPath, i) => {
                  let pathLength = 0;
                  if (document.getElementById('movePath')){
                  // @ts-expect-error null exception crap
                  pathLength = document.getElementById('movePath').getTotalLength();}
                  const numDots = Math.floor(pathLength / 1.5);

                  return [...Array(numDots)].map((_, index) => (
                      <circle key={index} r={.5} fill="yellow">
                          <animateMotion dur={30} repeatCount="indefinite" begin={index * .5}>
                              <mpath href="#movePath"/>
                          </animateMotion>
                      </circle>
                  ));
              }))}
 */

export { Lines };
