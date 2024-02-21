import { Nodes, Edges } from "database";
import PrismaClient from './bin/database-connection.ts';

class Graph {
    private nodes: Map<string, Nodes>;
    private edges: Map<string, Array<{ endNode: string; weight: number }>>;

    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    async loadGraphData() {

        const nodesData: Nodes[] = await PrismaClient.nodes.findMany();
        const edgesData: Edges[] = await PrismaClient.edges.findMany();


        nodesData.forEach((node) => {
            this.nodes.set(node.nodeID, node);
        });


        edgesData.forEach((edge) => {
            if (!this.edges.has(edge.startNode)) {
                this.edges.set(edge.startNode, []);
            }
            const adjacencyList = this.edges.get(edge.startNode);
            adjacencyList?.push({ endNode: edge.endNode, weight: edge.weight });
            
            if (!this.edges.has(edge.endNode)) {
                this.edges.set(edge.endNode, []);
            }
            const reverseAdjacencyList = this.edges.get(edge.endNode);
            reverseAdjacencyList?.push({ endNode: edge.startNode, weight: edge.weight });
        });
    }


    getNeighbors(nodeID: string): Array<{ endNode: string; weight: number }> | undefined {
        return this.edges.get(nodeID);
    }

    getNode(nodeID: string){
        return this.nodes.get(nodeID);
    }
}

class GraphSingleton {
    private static instance: Graph;

    private constructor() {

    }

    public static async getInstance(): Promise<Graph> {
        if (!GraphSingleton.instance) {
            GraphSingleton.instance = new Graph();
            await GraphSingleton.instance.loadGraphData();
        }
        return GraphSingleton.instance;
    }
}

export {GraphSingleton, Graph};

