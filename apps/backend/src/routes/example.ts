import express, { Router, Request, Response } from "express";
//import { Prisma } from "database";
//import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score

export default router;
