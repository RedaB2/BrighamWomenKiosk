import { IPathfindingStrategy } from "../IPathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

interface AStarNode {
  nodeId: string;
  gCost: number;
  hCost: number;
  fCost: number;
  parent?: AStarNode;
}

class AStarPathfindingStrategy implements IPathfindingStrategy {
  async findPath(
    startNodeId: string,
    endNodeId: string,
    graph: Graph
  ): Promise<string[]> {
    let openSet: AStarNode[] = [];
    const closedSet: Set<string> = new Set();

    const heuristic = (nodeIdA: string, nodeIdB: string): number => {
      const nodeA = graph.getNode(nodeIdA);
      const nodeB = graph.getNode(nodeIdB);

      if (!nodeA || !nodeB) {
        return Infinity;
      }

      const mapFloorToNumber = (floorLabel: string | number): number => {
        const mappings: { [key: string]: number } = {
          L1: -1,
          L2: -2,
          "1": 1,
          "2": 2,
          "3": 3,
        };
        return mappings[floorLabel.toString()] || 0;
      };

      const floorA = mapFloorToNumber(nodeA.floor);
      const floorB = mapFloorToNumber(nodeB.floor);
      const sameFloor = floorA === floorB;
      let distance;

      if (sameFloor) {
        const dx = nodeA.xcoord - nodeB.xcoord;
        const dy = nodeA.ycoord - nodeB.ycoord;
        distance = Math.sqrt(dx * dx + dy * dy);

        if (nodeA.nodeType === "ELEV" || nodeB.nodeType === "ELEV") {
          distance += 10000;
        }
      } else {
        distance = Math.abs(floorA - floorB) * 100;
      }

      return distance;
    };

    openSet.push({
      nodeId: startNodeId,
      gCost: 0,
      hCost: heuristic(startNodeId, endNodeId),
      fCost: heuristic(startNodeId, endNodeId),
    });

    while (openSet.length > 0) {
      let current = openSet.reduce((prev, curr) =>
        prev.fCost < curr.fCost ? prev : curr
      );

      if (current.nodeId === endNodeId) {
        const path = [];
        while (current) {
          path.unshift(current.nodeId);
          if (!current.parent) break;
          current = current.parent;
        }
        return path;
      }

      openSet = openSet.filter((node) => node.nodeId !== current.nodeId);
      closedSet.add(current.nodeId);

      const neighbors = graph.getNeighbors(current.nodeId);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (closedSet.has(neighbor.endNode)) continue;

          const tentativeGCost = current.gCost + neighbor.weight;
          let neighborNode = openSet.find((n) => n.nodeId === neighbor.endNode);
          let isNewPathShorter = false;

          if (!neighborNode) {
            neighborNode = {
              nodeId: neighbor.endNode,
              gCost: Infinity,
              hCost: heuristic(neighbor.endNode, endNodeId),
              fCost: Infinity,
            };
            openSet.push(neighborNode);
            isNewPathShorter = true;
          } else if (tentativeGCost < neighborNode.gCost) {
            isNewPathShorter = true;
          }

          if (isNewPathShorter) {
            neighborNode.gCost = tentativeGCost;
            neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
            neighborNode.parent = current;
          }
        }
      }
    }

    return [];
  }
}

export { AStarPathfindingStrategy };
