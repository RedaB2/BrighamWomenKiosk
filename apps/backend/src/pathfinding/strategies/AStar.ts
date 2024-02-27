import { BasePathfindingStrategy } from "../BasePathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

interface AStarNode {
  nodeId: string;
  gCost: number;
  hCost: number;
  fCost: number;
  parent?: AStarNode;
}

class AStarPathfindingStrategy extends BasePathfindingStrategy {
  private openSet: AStarNode[] = [];
  private closedSet: Set<string> = new Set();

  protected setup(): boolean {
    return true;
  }

  protected async algorithm(
    startNodeId: string,
    endNodeId: string,
    graph: Graph
  ): Promise<string[]> {
    const startNode = graph.getNode(startNodeId);
    const endNode = graph.getNode(endNodeId);
    if (!startNode || !endNode) return [];

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

    const startFloor = mapFloorToNumber(startNode.floor);
    const endFloor = mapFloorToNumber(endNode.floor);
    const sameFloor = startFloor === endFloor;

    const heuristic = (nodeIdA: string, nodeIdB: string): number => {
      const nodeA = graph.getNode(nodeIdA);
      const nodeB = graph.getNode(nodeIdB);

      if (!nodeA || !nodeB) return Infinity;

      const nodeAFloor = mapFloorToNumber(nodeA.floor);
      const nodeBFloor = mapFloorToNumber(nodeB.floor);

      const verticalDistance = Math.abs(nodeAFloor - nodeBFloor);
      const horizontalDistance = Math.sqrt(
        Math.pow(nodeA.xcoord - nodeB.xcoord, 2) +
          Math.pow(nodeA.ycoord - nodeB.ycoord, 2)
      );

      const verticalCostMultiplier =
        sameFloor && verticalDistance > 0 ? 100 : 50;

      return horizontalDistance + verticalCostMultiplier * verticalDistance;
    };

    this.openSet.push({
      nodeId: startNodeId,
      gCost: 0,
      hCost: heuristic(startNodeId, endNodeId),
      fCost: heuristic(startNodeId, endNodeId),
    });

    while (this.openSet.length > 0) {
      let current = this.openSet.reduce((prev, curr) =>
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

      this.openSet = this.openSet.filter(
        (node) => node.nodeId !== current.nodeId
      );
      this.closedSet.add(current.nodeId);

      const neighbors = graph.getNeighbors(current.nodeId);

      if (!neighbors) {
        return [];
      }

      neighbors.forEach((neighbor) => {
        if (this.closedSet.has(neighbor.endNode)) return;

        const neighborNodeData = graph.getNode(neighbor.endNode);
        if (!neighborNodeData) return;

        const tentativeGCost = current.gCost + neighbor.weight;
        let neighborNode = this.openSet.find(
          (n) => n.nodeId === neighbor.endNode
        );
        let isNewPathShorter = false;

        const neighborFloor = mapFloorToNumber(neighborNodeData.floor);
        const unnecessaryFloorChangePenalty =
          sameFloor && neighborFloor !== startFloor ? 1000 : 0;

        if (!neighborNode) {
          neighborNode = {
            nodeId: neighbor.endNode,
            gCost: Infinity,
            hCost: heuristic(neighbor.endNode, endNodeId),
            fCost: Infinity,
          };
          this.openSet.push(neighborNode);
          isNewPathShorter = true;
        } else if (
          tentativeGCost + unnecessaryFloorChangePenalty <
          neighborNode.gCost
        ) {
          isNewPathShorter = true;
        }

        if (isNewPathShorter) {
          neighborNode.gCost = tentativeGCost + unnecessaryFloorChangePenalty;
          neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
          neighborNode.parent = current;
        }
      });
    }

    return [];
  }

  protected teardown(path: string[]): string[] {
    // Reset state for potential reuse
    this.openSet = [];
    this.closedSet.clear();
    return path; // No modification to path in teardown
  }
}

export { AStarPathfindingStrategy };
