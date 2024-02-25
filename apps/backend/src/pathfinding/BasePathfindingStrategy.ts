import { Graph } from "./GraphSingleton.ts";
import { IPathfindingStrategy } from "./IPathfindingStrategy.ts";

abstract class BasePathfindingStrategy implements IPathfindingStrategy {
    async findPath(startNodeId: string, endNodeId: string, graph: Graph): Promise<string[]> {
        const initialSetup = this.setup(startNodeId, endNodeId, graph);
        if (!initialSetup) return [];

        const path = await this.algorithm(startNodeId, endNodeId, graph);

        return this.teardown(path);
    }


    protected abstract setup(startNodeId: string, endNodeId: string, graph: Graph): boolean;


    protected abstract algorithm(startNodeId: string, endNodeId: string, graph: Graph): Promise<string[]>;


    protected abstract teardown(path: string[]): string[];
}

export { BasePathfindingStrategy };
