import { BasePathfindingStrategy } from "../BasePathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

interface DijkstraNode {
  nodeId: string;
  cost: number;
  parent?: string;
}

class DijkstraPathfindingStrategy extends BasePathfindingStrategy {
  private visited: Set<string> = new Set();
  private costs: Map<string, number> = new Map();
  private parents: Map<string, string | undefined> = new Map();
  private nodesQueue: DijkstraNode[] = [];

  protected setup(startNodeId: string): boolean {
    this.costs.set(startNodeId, 0);
    this.parents.clear();
    this.nodesQueue.push({ nodeId: startNodeId, cost: 0, parent: undefined });
    return true;
  }

  protected async algorithm(
    startNodeId: string,
    endNodeId: string,
    graph: Graph
  ): Promise<string[]> {
    while (this.nodesQueue.length > 0) {
      this.nodesQueue.sort((a, b) => a.cost - b.cost);
      const currentNode = this.nodesQueue.shift()!;

      if (currentNode.nodeId === endNodeId) {
        break; // End node has been reached
      }

      if (!this.visited.has(currentNode.nodeId)) {
        this.visited.add(currentNode.nodeId);
        const neighbors = graph.getNeighbors(currentNode.nodeId);
        if (neighbors) {
          neighbors.forEach(({ endNode, weight }) => {
            if (!this.visited.has(endNode)) {
              const newCost = currentNode.cost + weight;
              const currentCost = this.costs.get(endNode) || Infinity;

              if (newCost < currentCost) {
                this.costs.set(endNode, newCost);
                this.parents.set(endNode, currentNode.nodeId);
                this.nodesQueue.push({
                  nodeId: endNode,
                  cost: newCost,
                  parent: currentNode.nodeId,
                });
              }
            }
          });
        }
      }
    }

    return this.reconstructPath(startNodeId, endNodeId);
  }

  protected teardown(path: string[]): string[] {
    // Reset state for potential reuse
    this.visited.clear();
    this.costs.clear();
    this.parents.clear();
    this.nodesQueue = [];
    return path;
  }

  private reconstructPath(startNodeId: string, endNodeId: string): string[] {
    const path: string[] = [];
    let currentNodeId: string | undefined = endNodeId;

    while (currentNodeId !== undefined && currentNodeId !== startNodeId) {
      path.unshift(currentNodeId);
      currentNodeId = this.parents.get(currentNodeId);
    }

    if (currentNodeId === startNodeId) {
      path.unshift(startNodeId);
    }

    return path;
  }
}

export { DijkstraPathfindingStrategy };
