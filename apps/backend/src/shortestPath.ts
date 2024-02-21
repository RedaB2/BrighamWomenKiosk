import {Graph} from "./GraphSingleton.ts";


// BFS ALGORITHM
async function bfsShortestPath(startNodeId: string, endNodeId: string, graph: Graph): Promise<string[]> {
    console.log(`BFS: Start - ${startNodeId}, End - ${endNodeId}`);
    const visited = new Set<string>();
    const queue: Array<{ node: string; path: string[] }> = [{ node: startNodeId, path: [startNodeId] }];

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

// DFS ALGORITHM
async function dfsShortestPath(startNodeId: string, endNodeId: string, graph: Graph): Promise<string[]> {
    console.log(`DFS: Start - ${startNodeId}, End - ${endNodeId}`);
    const visited = new Set<string>();
    let pathFound: string[] = [];

    const dfs = async (nodeId: string, path: string[]): Promise<void> => {
        console.log(`DFS Visiting: Node - ${nodeId}`);
        if (nodeId === endNodeId) {
            console.log(`DFS Path Found: ${path.join(" -> ")}`);
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
                        console.log(`DFS Exiting Node: ${nodeId} as Path Found`);
                        return;
                    }
                }
            }
        }
    };

    await dfs(startNodeId, [startNodeId]);
    if (pathFound.length === 0) {
        console.log(`DFS: No path found from ${startNodeId} to ${endNodeId}`);
    }
    return pathFound;
}
interface AStarNode {
    nodeId: string;
    gCost: number;
    hCost: number;
    fCost: number;
    parent?: AStarNode;
}

const mapFloorToNumber = (floorLabel: string | number): number => {
    const mappings: { [key: string]: number } = {
        L1: -1,
        L2: -2,
        '1': 1,
        '2': 2,
        '3': 3,
    };
    return mappings[floorLabel.toString()] || 0;
};


function heuristic(nodeIdA: string, nodeIdB: string, graph: Graph): number {
    const nodeA = graph.getNode(nodeIdA);
    const nodeB = graph.getNode(nodeIdB);

    if (!nodeA || !nodeB) {
        return 0;
    }

    const floorA = mapFloorToNumber(nodeA.floor);
    const floorB = mapFloorToNumber(nodeB.floor);
    const sameFloor = floorA === floorB;
    let distance;

    if (sameFloor) {
        const dx = nodeA.xcoord - nodeB.xcoord;
        const dy = nodeA.ycoord - nodeB.ycoord;
        distance = Math.sqrt(dx * dx + dy * dy);

        if ((nodeA.nodeType === 'ELEV' || nodeB.nodeType === 'ELEV')) {
            distance += 10000; // Arbitrary large penalty
        }
    } else {
        distance = Math.abs(floorA - floorB);
    }

    return distance;
}


function shortestPathAStar(startNodeId: string, endNodeId: string, graph: Graph): string[] {
    let openSet: AStarNode[] = [];
    let closedSet: Set<string> = new Set();

    openSet.push({
        nodeId: startNodeId,
        gCost: 0,
        hCost: heuristic(startNodeId, endNodeId, graph),
        fCost: heuristic(startNodeId, endNodeId, graph),
    });

    while (openSet.length > 0) {
        let current = openSet.reduce((prev, curr) => prev.fCost < curr.fCost ? prev : curr);

        if (current.nodeId === endNodeId) {
            let path = [];
            while (current) {
                path.unshift(current.nodeId);
                current = current.parent;
            }
            return path;
        }

        openSet = openSet.filter(node => node.nodeId !== current.nodeId);
        closedSet.add(current.nodeId);

        const neighbors = graph.getNeighbors(current.nodeId);
        if (neighbors) {
            for (const neighbor of neighbors) {
                if (closedSet.has(neighbor.endNode)) continue;

                const tentativeGCost = current.gCost + neighbor.weight;
                let neighborNode = openSet.find(n => n.nodeId === neighbor.endNode);
                let isNewPathShorter = false;

                if (!neighborNode) {
                    neighborNode = {
                        nodeId: neighbor.endNode,
                        gCost: Infinity,
                        hCost: heuristic(neighbor.endNode, endNodeId, graph),
                        fCost: Infinity,
                    };
                    openSet.push(neighborNode);
                    isNewPathShorter = true;
                } else if (tentativeGCost < neighborNode.gCost) {
                    isNewPathShorter = true;
                }

                if (isNewPathShorter) {
                    neighborNode.gCost = tentativeGCost;
                    neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
                    neighborNode.parent = current;
                }
            }
        }
    }

    return [];
}







export { bfsShortestPath, dfsShortestPath, shortestPathAStar };
