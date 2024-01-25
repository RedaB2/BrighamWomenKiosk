import path from "path";
import { PrismaClient } from '../.prisma/client';
import { readCSV } from "./csvReader.mjs";

const prisma = new PrismaClient();
const nodesPath = path.join(path.resolve(), "prisma/L1Nodes.csv");
const edgesPath = path.join(path.resolve(), "prisma/L1Edges.csv");

const main = async () => {
    const nodes = readCSV(nodesPath);
    const edges = readCSV(edgesPath);

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
        await prisma.edges.create({
        data: {
            ...edge,
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
