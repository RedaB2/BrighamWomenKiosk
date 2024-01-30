import path from "path";
import { PrismaClient } from "../.prisma/client";
import { readCSV } from "./csvReader.mjs";
import { calculateEdgeWeights } from "./weightCalculator.mjs";

const prisma = new PrismaClient();
const nodesPath = path.join(path.resolve(), "prisma/L1Nodes.csv");
const edgesPath = path.join(path.resolve(), "prisma/L1Edges.csv");

const main = async () => {
  // read csv data
  const nodes = readCSV(nodesPath);
  const edges = readCSV(edgesPath);
  // calculate weight of edges
  const edgeWeights = calculateEdgeWeights(nodes, edges);

  // seed with nodes
  for (const node of nodes) {
    await prisma.nodes.create({
      data: {
        ...node,
        xcoord: Number(node.xcoord),
        ycoord: Number(node.ycoord),
      },
    });
  }
  for (const edge of edges) {
    const edgeWeightEntry = edgeWeights.find(
      (element) => element.edgeID === edge.edgeID,
    );

    if (!edgeWeightEntry) {
      console.error(`No weight found for edgeID: ${edge.edgeID}`);
      continue; // Skip this edge if no weight is found
    }

    await prisma.edges.create({
      data: {
        ...edge,
        weight: edgeWeightEntry.weight,
      },
    });
  }
};
try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
