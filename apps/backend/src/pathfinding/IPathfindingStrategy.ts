import { Graph } from "./GraphSingleton.ts";

interface IPathfindingStrategy {
  findPath(
    startNodeId: string,
    endNodeId: string,
    graph: Graph
  ): Promise<string[]>;
}

export type { IPathfindingStrategy };
