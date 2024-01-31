import { createGraph, dijkstraPathFinder } from "../src/shortestPath.ts";
import { describe, it, expect } from "vitest";

describe("Dijkstra Path Finder", () => {
  it("should find the shortest path in a graph", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "B", endNode: "C", weight: 2 },
      { startNode: "A", endNode: "C", weight: 10 },
    ];

    const graph = createGraph(edges);
    const path = dijkstraPathFinder("A", "C", graph);

    expect(path).toEqual(["A", "B", "C"]);
  });

  it("should return an empty array if no path exists", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "C", endNode: "D", weight: 2 },
    ];

    const graph = createGraph(edges);
    const path = dijkstraPathFinder("A", "D", graph);

    expect(path).toEqual([]);
  });

  it("should find a direct path when it's the shortest", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 5 },
      { startNode: "A", endNode: "C", weight: 15 },
      { startNode: "B", endNode: "C", weight: 5 },
    ];

    const graph = createGraph(edges);
    const path = dijkstraPathFinder("A", "B", graph);

    expect(path).toEqual(["A", "B"]);
  });

  it("should handle a graph with a single node", () => {
    const edges = [{ startNode: "A", endNode: "A", weight: 0 }];

    const graph = createGraph(edges);
    const path = dijkstraPathFinder("A", "A", graph);

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
    const path = dijkstraPathFinder("A", "D", graph);

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
    const path = dijkstraPathFinder("A", "D", graph);

    expect(path).toEqual([]);
  });
});
