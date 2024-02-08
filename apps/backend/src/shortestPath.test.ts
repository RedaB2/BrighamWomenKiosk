import { createGraph, shortestPathAStar, dijkstraShortestPath, bfsShortestPath } from "./shortestPath.ts";
import { describe, it, expect } from "vitest";

describe("A Star Path Finder", () => {
  it("should find the shortest path in a graph", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "B", endNode: "C", weight: 2 },
      { startNode: "A", endNode: "C", weight: 10 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "C", graph);

    expect(path).toEqual(["A", "B", "C"]);
  });

  it("should return an empty array if no path exists", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "C", endNode: "D", weight: 2 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "D", graph);

    expect(path).toEqual([]);
  });

  it("should find a direct path when it's the shortest", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 5 },
      { startNode: "A", endNode: "C", weight: 15 },
      { startNode: "B", endNode: "C", weight: 5 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "B", graph);

    expect(path).toEqual(["A", "B"]);
  });

  it("should handle a graph with a single node", () => {
    const edges = [{ startNode: "A", endNode: "A", weight: 0 }];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "A", graph);

    expect(path).toEqual(["A"]);
  });

  it("should return the shortest path when multiple paths with the same weight exist", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 2 },
      { startNode: "A", endNode: "C", weight: 2 },
      { startNode: "B", endNode: "D", weight: 1 },
      { startNode: "C", endNode: "D", weight: 1 },
      { startNode: "A", endNode: "D", weight: 3 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "D", graph);

    // The shortest path can be either 'A' -> 'D' directly, or 'A' -> 'B' -> 'D', or 'A' -> 'C' -> 'D'
    expect(path).toContain("A");
    expect(path).toContain("D");
    expect(path.length).toBeLessThanOrEqual(3); // The path should not be longer than 3 nodes
  });

  it("should return an empty array for disconnected components", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "C", endNode: "D", weight: 1 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "D", graph);

    expect(path).toEqual([]);
  });
});

describe("A Star Path Finder Additional Tests", () => {
  it("should avoid paths with high weight if possible", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "B", endNode: "C", weight: 10 }, // High weight edge
      { startNode: "A", endNode: "C", weight: 2 },
      { startNode: "C", endNode: "D", weight: 2 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "D", graph);

    expect(path).toEqual(["A", "C", "D"]);
  });
});

describe("Pathfinding Algorithms", () => {
    const edges = [
        { startNode: "A", endNode: "B", weight: 1 },
        { startNode: "B", endNode: "C", weight: 2 },
        { startNode: "A", endNode: "C", weight: 4 },
        { startNode: "C", endNode: "D", weight: 1 },
        { startNode: "B", endNode: "D", weight: 5 },
    ];
    const graph = createGraph(edges);

    // A* Tests
    describe("A* Algorithm", () => {
        it("returns an empty array if no path exists", () => {
            const path = shortestPathAStar("A", "E", graph);
            expect(path).toEqual([]);
        });
    });

    // BFS Tests
    describe("BFS Algorithm", () => {
        it("finds the shortest path in terms of edges in an unweighted graph", () => {
            const path = bfsShortestPath("A", "D", graph);
            // Expecting the shortest path in terms of edge count, not weight
            expect(path.length).toBeLessThanOrEqual(3); // A->B->D or A->C->D
        });

        it("returns an empty array if no path exists", () => {
            const path = bfsShortestPath("A", "E", graph);
            expect(path).toEqual([]);
        });
    });

    // Dijkstra Tests
    describe("Dijkstra Algorithm", () => {

        it("handles graphs with single nodes", () => {
            const singleNodeGraph = createGraph([{ startNode: "A", endNode: "A", weight: 0 }]);
            const path = dijkstraShortestPath("A", "A", singleNodeGraph);
            expect(path).toEqual(["A"]);
        });

        it("returns an empty array for disconnected components", () => {
            const disconnectedEdges = [
                { startNode: "A", endNode: "B", weight: 1 },
                { startNode: "C", endNode: "D", weight: 1 },
            ];
            const disconnectedGraph = createGraph(disconnectedEdges);
            const path = dijkstraShortestPath("A", "D", disconnectedGraph);
            expect(path).toEqual([]);
        });
    });
});
