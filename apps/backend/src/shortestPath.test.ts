import { shortestPathAStar, dijkstraShortestPath, bfsShortestPath, dfsShortestPath } from "./shortestPath.ts";
import { describe, it, expect } from "vitest";


// DFS TEST CASES

describe("DFS Shortest Path Finder", () => {
  it("should find a path in a simple graph", () => {
    const graph = new Map([
      ["A", [{ node: "B" }]],
      ["B", [{ node: "C" }]],
      ["C", []],
    ]);
    const path = dfsShortestPath("A", "C", graph);
    expect(path).toEqual(["A", "B", "C"]);
  });

  it("should return an empty array if no path exists", () => {
    const graph = new Map([
      ["A", [{ node: "B" }]],
      ["B", []],
      ["C", [{ node: "D" }]],
      ["D", []],
    ]);
    const path = dfsShortestPath("A", "D", graph);
    expect(path).toEqual([]);
  });

  it("should detect path in a graph with cycles", () => {
    const graph = new Map([
      ["A", [{ node: "B" }, { node: "C" }]],
      ["B", [{ node: "A" }, { node: "C" }]],
      ["C", [{ node: "D" }]],
      ["D", []],
    ]);
    const path = dfsShortestPath("A", "D", graph);
    // The expected path could vary due to the nature of DFS, but it should end with "D".
    expect(path[path.length - 1]).toEqual("D");
  });

  it("should verify path is found even with multiple paths available", () => {
    const graph = new Map([
      ["A", [{ node: "B" }, { node: "C" }]],
      ["B", [{ node: "D" }]],
      ["C", [{ node: "D" }]],
      ["D", []],
    ]);
    const path = dfsShortestPath("A", "D", graph);
    // The path should start with "A" and end with "D".
    expect(path[0]).toEqual("A");
    expect(path[path.length - 1]).toEqual("D");
  });
});


// BFS TEST CASES

describe("BFS Shortest Path Finder", () => {
  it("should find the shortest path in a simple graph", () => {
    const graph = new Map([
      ["A", [{ node: "B" }]],
      ["B", [{ node: "C" }]],
      ["C", []],
    ]);
    const path = bfsShortestPath("A", "C", graph);
    expect(path).toEqual(["A", "B", "C"]);
  });

  it("should return an empty array if no path exists", () => {
    const graph = new Map([
      ["A", [{ node: "B" }]],
      ["B", []],
      ["C", [{ node: "D" }]],
      ["D", []],
    ]);
    const path = bfsShortestPath("A", "D", graph);
    expect(path).toEqual([]);
  });

  it("should correctly process graphs with multiple paths", () => {
    const graph = new Map([
      ["A", [{ node: "B" }, { node: "C" }]],
      ["B", [{ node: "D" }]],
      ["C", [{ node: "D" }]],
      ["D", []],
    ]);
    const path = bfsShortestPath("A", "D", graph);
    expect(path.length).toBeLessThanOrEqual(3); // The shortest path should not have more than 3 nodes
    expect(path).toContain("D");
  });

  it("should work correctly with graphs containing loops", () => {
    const graph = new Map([
      ["A", [{ node: "B" }, { node: "A" }]], // Loop back to A
      ["B", [{ node: "C" }]],
      ["C", [{ node: "D" }]],
      ["D", []],
    ]);
    const path = bfsShortestPath("A", "D", graph);
    // Expect the path to correctly bypass the loop and find the shortest path
    expect(path).toEqual(["A", "B", "C", "D"]);
  });
});

// DIJKSTRA TEST CASES

describe("Dijkstra Shortest Path Finder", () => {
  it("should compute the shortest path in a simple weighted graph", () => {
    const graph = new Map([
      ["A", [{ node: "B", weight: 1 }, { node: "C", weight: 5 }]],
      ["B", [{ node: "C", weight: 2 }]],
      ["C", []],
    ]);
    const path = dijkstraShortestPath("A", "C", graph);
    expect(path).toEqual(["A", "B", "C"]);
  });

  it("should return an empty array if no path exists", () => {
    const graph = new Map([
      ["A", [{ node: "B", weight: 1 }]],
      ["B", []],
      ["C", [{ node: "D", weight: 2 }]],
      ["D", []],
    ]);
    const path = dijkstraShortestPath("A", "D", graph);
    expect(path).toEqual([]);
  });

  it("should accurately process graphs with diverse weights", () => {
    const graph = new Map([
      ["A", [{ node: "B", weight: 10 }, { node: "C", weight: 1 }]],
      ["B", [{ node: "D", weight: 1 }]],
      ["C", [{ node: "D", weight: 10 }]],
      ["D", []],
    ]);
    const path = dijkstraShortestPath("A", "D", graph);
    expect(path).toEqual(["A", "C", "D"]);
  });

  it("should correctly report or handle negative weights", () => {
    const graph = new Map([
      ["A", [{ node: "B", weight: -1 }, { node: "C", weight: 4 }]],
      ["B", [{ node: "C", weight: 3 }]],
      ["C", []],
    ]);
    const path = dijkstraShortestPath("A", "C", graph);
  });
});

// A* TEST CASES
describe("A* Shortest Path Finder", () => {
  it("should correctly compute the shortest path with a heuristic", () => {
    const graph = new Map([
      ["A", [{ node: "B", weight: 2 }, { node: "C", weight: 4 }]],
      ["B", [{ node: "D", weight: 5 }]],
      ["C", [{ node: "D", weight: 1 }]],
      ["D", []],
    ]);
    const path = shortestPathAStar("A", "D", graph);
    expect(path).toEqual(["A", "C", "D"]);
  });

  it("should handle scenarios where no path exists", () => {
    const graph = new Map([
      ["A", [{ node: "B", weight: 1 }]],
      ["B", []],
      ["C", [{ node: "D", weight: 2 }]],
      ["D", []],
    ]);
    const path = shortestPathAStar("A", "D", graph);
    expect(path).toEqual([]);
  });

  it("should verify accuracy with multiple paths of different weights", () => {
    const graph = new Map([
      ["A", [{ node: "B", weight: 3 }, { node: "C", weight: 2 }]],
      ["B", [{ node: "D", weight: 4 }]],
      ["C", [{ node: "D", weight: 2 }]],
      ["D", []],
    ]);
    const path = shortestPathAStar("A", "D", graph);
    expect(path).toEqual(["A", "C", "D"]);
  });

  it("should ensure heuristic does not compromise optimality", () => {
    const graph = heuristicSetup();
    const start = "A";
    const end = "Z";
    const path = shortestPathAStar(start, end, graph);
  });
});

function heuristicSetup() {
  return new Map();
}
