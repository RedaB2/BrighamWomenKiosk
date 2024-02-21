import { Graph } from "./GraphSingleton.ts";
import { IPathfindingStrategy } from "./IPathfindingStrategy.ts";

export class PathfindingContext {
  private strategy: IPathfindingStrategy;

  constructor(strategy: IPathfindingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IPathfindingStrategy) {
    this.strategy = strategy;
  }

  async findPath(
    startNodeId: string,
    endNodeId: string,
    graph: Graph
  ): Promise<string[]> {
    return this.strategy.findPath(startNodeId, endNodeId, graph);
  }
}
