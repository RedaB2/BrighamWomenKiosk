type Edge = {
    startNode: string;
    endNode: string;
    weight: number;
};

type Graph = Map<string, Array<{ node: string; weight: number }>>;

export function createGraph(edges: Edge[]): Graph {
    const graph = new Map<string, Array<{ node: string; weight: number }>>();

    edges.forEach((edge) => {
        if (!graph.has(edge.startNode)) {
            graph.set(edge.startNode, []);
        }
        if (!graph.has(edge.endNode)) {
            graph.set(edge.endNode, []);
        }

        graph
            .get(edge.startNode)
            ?.push({ node: edge.endNode, weight: edge.weight });
        // If the edges are bidirectional, also add the reverse edge
        graph
            .get(edge.endNode)
            ?.push({ node: edge.startNode, weight: edge.weight });
    });

    return graph;
}

export function dijkstraPathFinder(
    start: string,
    end: string,
    graph: Graph,
): string[] {
    const distances = new Map<string, number>();
    const predecessor: { [key: string]: string } = {};
    const pq = new PriorityQueue();
    pq.enqueue(start, 0);

    graph.forEach((_, node) => {
        distances.set(node, Infinity);
    });
    distances.set(start, 0);

    while (!pq.isEmpty()) {
        const { element: currentNode, priority: currentDistance } = pq.dequeue();

        if (currentNode === end) {
            return reconstructPath(predecessor, start, end);
        }

        graph.get(currentNode)?.forEach((neighbor) => {
            const distance = currentDistance + neighbor.weight;

            if (distance < (distances.get(neighbor.node) || Infinity)) {
                distances.set(neighbor.node, distance);
                predecessor[neighbor.node] = currentNode;
                pq.enqueue(neighbor.node, distance);
            }
        });
    }
    return []; // Path not found
}

class PriorityQueue {
    private items: Array<{ element: string; priority: number }>;

    constructor() {
        this.items = [];
    }

    enqueue(element: string, priority: number): void {
        const queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue(): { element: string; priority: number } {
        return this.items.shift()!;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

// Helper function to reconstruct the path from the predecessor map
function reconstructPath(
    predecessor: { [key: string]: string },
    start: string,
    end: string,
): string[] {
    const path = [end];
    while (path[0] !== start) {
        path.unshift(predecessor[path[0]]);
    }
    return path;
}
