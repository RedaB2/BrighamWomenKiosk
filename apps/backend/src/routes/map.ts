import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import multer from "multer";
import { objectsToCSV } from "../utils";
import { createGraph, shortestPathAStar } from "../shortestPath.ts";

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

router.post("/upload", upload.single("csv-upload"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was selected");
  }

  if (req.file.mimetype != "text/csv") {
    return res.status(400).send("Invalid file type");
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
  const { startNodeId, endNodeId } = req.body;

  if (!startNodeId || !endNodeId) {
    return res.status(400).send("Both startNodeId and endNodeId are required");
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
    const pathNodeIds = shortestPathAStar(
      startNodeId as string,
      endNodeId as string,
      graph
    );

    res.json({ path: pathNodeIds });
  } catch (error) {
    console.error("Error processing find-path request:", error);
    res.status(500).send("Internal server error");
  }
});

export default router;
