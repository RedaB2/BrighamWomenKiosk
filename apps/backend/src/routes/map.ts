import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import multer from "multer";

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploaded-csvs/"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

router.get("/nodes", async function (req: Request, res: Response) {
  const nodes = await PrismaClient.nodes.findMany();
  res.json(nodes);
});

router.get("/edges", async function (req: Request, res: Response) {
  const edges = await PrismaClient.edges.findMany();
  res.json(edges);
});

router.post("/upload", upload.single("poster"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was selected");
  }
  if (req.file.mimetype != "text/csv") {
    return res.status(400).send("File type not accepted");
  }

  res.redirect("/csv-data");
});

export default router;
