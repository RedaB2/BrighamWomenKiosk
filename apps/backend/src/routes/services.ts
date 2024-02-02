import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  const requests = await PrismaClient.requests.findMany();
  res.json(requests);
});

router.post("/", async (req, res) => {
  const { type, urgency, notes, nodeID } = req.body;
  await PrismaClient.requests.create({
    data: {
      type,
      urgency,
      notes,
      room: {
        connect: {
          nodeID,
        },
      },
    },
  });
  res.status(200).send("Service request received");
});

export default router;
