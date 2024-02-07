import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { objectsToCSV } from "../utils";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  const requests = await PrismaClient.employees.findMany();
  res.json(requests);
});

router.get("/download", async function (req: Request, res: Response) {
  try {
    const employees = await PrismaClient.employees.findMany();
    const csvData = objectsToCSV(employees);
    res.header("Content-Type", "text/csv");
    res.attachment("employees.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;
