import PrismaClient from "./bin/database-connection.ts";
import { createGraph } from "./shortestPath.ts";

type Graph = Map<string, Array<{ node: string; weight: number }>>;

class uniqueGraph {
  private static instance: Graph;
  private static initializationCount = 0;

  public static async getInstance(): Promise<Graph> {
    if (!uniqueGraph.instance) {
      const edges = await PrismaClient.edges.findMany();
      const allNodes = await PrismaClient.nodes.findMany();
      const nodesMap = new Map(allNodes.map((node) => [node.nodeID, node]));
      uniqueGraph.instance = createGraph(edges, nodesMap, true);
      uniqueGraph.initializationCount++;
    }
    return uniqueGraph.instance;
  }
  public static getInitializationCount(): number {
    return uniqueGraph.initializationCount;
  }
}

export default uniqueGraph;
