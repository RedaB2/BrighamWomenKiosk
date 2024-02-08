import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import multer from "multer";
import { readCSV, objectsToCSV } from "../utils";
import { Prisma } from "database";
import { createGraph, shortestPathAStar, bfsShortestPath, dijkstraShortestPath } from "../shortestPath.ts";

const router: Router = express.Router();

router.get("/nodes", async function (req: Request, res: Response) {
  const nodes = await PrismaClient.nodes.findMany();
  res.json(nodes);
});

router.get("/edges", async function (req: Request, res: Response) {
  const edges = await PrismaClient.edges.findMany();
  res.json(edges);
});

const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router.post("/upload/nodes", upload.single("csv-upload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was selected");
  }

  if (req.file.mimetype != "text/csv") {
    return res.status(400).send("Invalid file type");
  }
  const newNodes = readCSV(req.file.path);
  newNodes.forEach((node) => {
    node.xcoord = Number(node.xcoord);
    node.ycoord = Number(node.ycoord);
  });
  try {
    await PrismaClient.$transaction(async (tx) => {
      // 1. Get all the existing data and hold them in-memory
      // const existingNodes = await tx.nodes.findMany();
      const existingEdges = await tx.edges.findMany();
      const existingEmployees = await tx.employees.findMany();
      const existingRequests = await tx.requests.findMany();

      // 2. Drop all the tables in the order of foreign key dependencies
      await tx.edges.deleteMany();
      await tx.requests.deleteMany();
      await tx.employees.deleteMany();
      await tx.nodes.deleteMany();

      // 3. Re-seed the database
      await tx.nodes.createMany({
        data: newNodes as unknown as Prisma.NodesCreateManyInput,
      });

      await tx.edges.createMany({
        data: existingEdges,
      });

      await tx.employees.createMany({
        data: existingEmployees,
      });

      await tx.requests.createMany({
        data: existingRequests,
      });
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return res.status(400).send("Bad request");
  }

  res.status(200).send("File uploaded successfully");
});

router.post("/upload/edges", upload.single("csv-upload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was selected");
  }

  if (req.file.mimetype != "text/csv") {
    return res.status(400).send("Invalid file type");
  }
  const newEdges = readCSV(req.file.path);
  newEdges.forEach((edge) => {
    edge.weight = Number(edge.weight);
  });
  try {
    await PrismaClient.$transaction(async (tx) => {
      // 1. Get all the existing data and hold them in-memory
      // const existingNodes = await tx.nodes.findMany();
      const existingNodes = await tx.nodes.findMany();
      const existingEmployees = await tx.employees.findMany();
      const existingRequests = await tx.requests.findMany();

      // 2. Drop all the tables in the order of foreign key dependencies
      await tx.edges.deleteMany();
      await tx.requests.deleteMany();
      await tx.employees.deleteMany();
      await tx.nodes.deleteMany();

      // 3. Re-seed the database
      await tx.nodes.createMany({
        data: existingNodes,
      });

      await tx.edges.createMany({
        data: newEdges as unknown as Prisma.EdgesCreateManyInput,
      });

      await tx.employees.createMany({
        data: existingEmployees,
      });

      await tx.requests.createMany({
        data: existingRequests,
      });
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return res.status(400).send("Bad request");
  }

  res.status(200).send("File uploaded successfully");
});

router.get("/download/nodes", async function (req: Request, res: Response) {
  try {
    const nodes = await PrismaClient.nodes.findMany();
    const csvData = objectsToCSV(nodes);
    res.header("Content-Type", "text/csv");
    res.attachment("nodes.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/download/edges", async function (req: Request, res: Response) {
  try {
    const edges = await PrismaClient.edges.findMany();
    const csvData = objectsToCSV(edges);
    res.header("Content-Type", "text/csv");
    res.attachment("edges.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/pathfinding", async function (req: Request, res: Response) {
    const { startNodeId, endNodeId, algorithm } = req.body;

    if (!startNodeId || !endNodeId) {
        return res.status(400).send("Both startNodeId and endNodeId are required");
    }

    if (!['AStar', 'BFS', 'Dijkstra'].includes(algorithm)) {
        return res.status(400).send("Invalid or missing algorithm type. Valid options are: 'AStar', 'BFS', 'Dijkstra'.");
    }

    try {
        // Check if the startNodeId exists
        const startNodeExists = await PrismaClient.nodes.findUnique({
            where: { nodeID: startNodeId as string },
        });

        if (!startNodeExists) {
            return res.status(404).send("Start node ID not found");
        }

        // Check if the endNodeId exists
        const endNodeExists = await PrismaClient.nodes.findUnique({
            where: { nodeID: endNodeId as string },
        });

        if (!endNodeExists) {
            return res.status(404).send("End node ID not found");
        }

        // Both nodes exist; proceed with finding the path
        const edges = await PrismaClient.edges.findMany();
        const graph = createGraph(edges);
        let pathNodeIds = [];

        switch (algorithm) {
            case 'AStar':
                pathNodeIds = shortestPathAStar(startNodeId as string, endNodeId as string, graph);
                break;
            case 'BFS':
                pathNodeIds = bfsShortestPath(startNodeId as string, endNodeId as string, graph);
                break;
            case 'Dijkstra':
                pathNodeIds = dijkstraShortestPath(startNodeId as string, endNodeId as string, graph);
                break;
            default:
                return res.status(400).send("Unsupported algorithm");
        }

        res.json({ path: pathNodeIds });
    } catch (error) {
        console.error("Error processing pathfinding request:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;
