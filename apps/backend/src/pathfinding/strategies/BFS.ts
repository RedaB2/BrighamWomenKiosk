import { IPathfindingStrategy } from "../IPathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

export class BFSPathfindingStrategy implements IPathfindingStrategy {
  async findPath(
    startNodeId: string,
    endNodeId: string,
    graph: Graph
  ): Promise<string[]> {
    const visited = new Set<string>();
    const queue: Array<{ node: string; path: string[] }> = [
      { node: startNodeId, path: [startNodeId] },
    ];

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;

      if (node === endNodeId) {
        return path;
      }

      const neighbors = graph.getNeighbors(node);
      if (neighbors) {
        for (const { endNode } of neighbors) {
          if (!visited.has(endNode)) {
            visited.add(endNode);
            queue.push({ node: endNode, path: [...path, endNode] });
          }
        }
      }
    }
    return [];
  }
}
