import { IPathfindingStrategy } from "../IPathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

export class DFSPathfindingStrategy implements IPathfindingStrategy {
  async findPath(
    startNodeId: string,
    endNodeId: string,
    graph: Graph
  ): Promise<string[]> {
    const visited = new Set<string>();
    let pathFound: string[] = [];

    const dfs = async (nodeId: string, path: string[]): Promise<void> => {
      if (nodeId === endNodeId) {
        pathFound = path;
        return;
      }
      visited.add(nodeId);

      const neighbors = graph.getNeighbors(nodeId);
      if (neighbors) {
        for (const { endNode } of neighbors) {
          if (!visited.has(endNode)) {
            await dfs(endNode, [...path, endNode]);
            if (pathFound.length > 0) {
              return;
            }
          }
        }
      }
    };

    await dfs(startNodeId, [startNodeId]);
    if (pathFound.length === 0) {
      return [];
    }
    return pathFound;
  }
}
