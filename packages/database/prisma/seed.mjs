import path from "path";
import { PrismaClient } from "../.prisma/client";
import { readCSV } from "./csvReader.mjs";
import { calculateEdgeWeights } from "./weightCalculator.mjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const nodesPath = path.join(path.resolve(), "prisma/nodes.csv");
const edgesPath = path.join(path.resolve(), "prisma/edges.csv");

const main = async () => {
  // read csv data
  const nodes = readCSV(nodesPath);
  const edges = readCSV(edgesPath);

  // calculate weight of edges
  const edgeWeights = calculateEdgeWeights(nodes, edges);

  // drop existing data
  await prisma.edges.deleteMany();
  await prisma.requests.deleteMany();
  await prisma.employeeJobs.deleteMany();
  await prisma.employees.deleteMany();
  await prisma.nodes.deleteMany();

  // seed with nodes
  nodes.forEach((node) => {
    node.xcoord = Number(node.xcoord);
    node.ycoord = Number(node.ycoord);
  });
  await prisma.nodes.createMany({
    data: nodes,
  });

  for (const edge of edges) {
    const edgeWeightEntry = edgeWeights.find(
      (element) => element.edgeID === edge.edgeID
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

  const nodeIds = await prisma.nodes.findMany({
    select: {
      nodeID: true,
    },
  });

  // seed employees
  for (let i = 0; i < 10; i++) {
    await prisma.employees.create({
      data: generateEmployee(nodeIds),
    });
  }

  await prisma.employees.createMany({
    data: [
      {
        firstName: "admin",
        lastName: "admin",
        role: "ADMIN",
        username: "admin",
        password: "admin",
      },
      {
        firstName: "Team",
        lastName: "C",
        role: "ADMIN",
        username: "softengc24C@gmail.com",
        password: "cs3733c24C!",
      },
    ],
  });
};

const generateEmployee = (nodeIds) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: faker.helpers.arrayElement(["ADMIN", "REGULAR"]),
    username: faker.internet.displayName(),
    password: faker.internet.password(),
    requests: {
      create: [
        {
          nodeID: faker.helpers.arrayElement(nodeIds).nodeID,
          urgency: faker.helpers.arrayElement(["LOW", "MEDIUM", "HIGH","EMERGENCY"]),
          type: faker.helpers.arrayElement([
            "JANI",
            "MECH",
            "MEDI",
            "RELC",
            "CONS",
            "CUST",
          ]),
          notes: faker.hacker.phrase(),
          completionStatus: faker.helpers.arrayElement([
            "UNASSIGNED",
            "ASSIGNED",
            "IN_PROGRESS",
            "COMPLETED",
          ]),
        },
      ],
    },
    jobs: {
      create: faker.helpers.arrayElements([
        { job: "JANITOR" },
        { job: "OFFICE_ADMIN" },
        { job: "DOCTOR" },
        { job: "NURSE" },
      ]),
    },
  };
};

try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
