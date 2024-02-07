import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { objectsToCSV } from "../utils";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  const requests = await PrismaClient.requests.findMany({
    orderBy: {
      id: "asc",
    },
  });
  res.json(requests);
});

router.get("/download", async function (req: Request, res: Response) {
  try {
    const services = await PrismaClient.requests.findMany();
    const csvData = objectsToCSV(services);
    res.header("Content-Type", "text/csv");
    res.attachment("services.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  const { type, urgency, notes, completionStatus, nodeID, employeeID } =
    req.body;
  await PrismaClient.requests.create({
    data: {
      type,
      urgency,
      notes,
      completionStatus,
      room: {
        connect: {
          nodeID,
        },
      },
      employee: {
        connect: {
          id: employeeID,
        },
      },
    },
  });
  res.status(200).send("Service request received");
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { completionStatus } = req.body;
  await PrismaClient.requests.update({
    where: {
      id,
    },
    data: {
      completionStatus,
    },
  });
  res.status(200).send("Service request updated");
});

export default router;
