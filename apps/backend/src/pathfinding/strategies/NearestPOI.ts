import { IPathfindingStrategy } from "../IPathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

class NearestPOIFindingStrategy implements IPathfindingStrategy {
    private poiTypes: string[];

    constructor(poiTypes: string[]) {
        this.poiTypes = poiTypes;
    }

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
            const nodeData = graph.getNode(node);

            if (nodeData && this.poiTypes.includes(nodeData.nodeType)) {
                return path;
            }

            visited.add(node);

            const neighbors = graph.getNeighbors(node);
            if (neighbors) {
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor.endNode)) {
                        visited.add(neighbor.endNode);
                        queue.push({ node: neighbor.endNode, path: [...path, neighbor.endNode] });
                    }
                }
            }
        }

        return [];
    }
}

export { NearestPOIFindingStrategy };
