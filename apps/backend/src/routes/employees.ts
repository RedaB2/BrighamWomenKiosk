import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { objectsToCSV, readCSV } from "../utils";
import multer from "multer";
import { Prisma } from "database";

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

router.post("/", async function (req: Request, res: Response) {
  try {
    const { firstName, lastName, role, username, password } = req.body;
    const employee = await PrismaClient.employees.create({
      data: {
        firstName,
        lastName,
        role,
        username,
        password,
      },
    });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/:id", async function (req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, role, username, password } = req.body;
    const employee = await PrismaClient.employees.update({
      where: {
        id: id,
      },
      data: {
        firstName,
        lastName,
        role,
        username,
        password,
      },
    });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async function (req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await PrismaClient.employees.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send("Employee deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("csv-upload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was selected");
  }

  if (req.file.mimetype != "text/csv") {
    return res.status(400).send("Invalid file type");
  }
  const newEmployees = readCSV(req.file.path);
  newEmployees.forEach((employee) => {
    employee.id = Number(employee.id);
  });
  try {
    await PrismaClient.$transaction(async (tx) => {
      // 1. Get all the existing data and hold them in-memory
      const existingNodes = await tx.nodes.findMany();
      const existingEdges = await tx.edges.findMany();
      // const existingEmployees = await tx.employees.findMany();
      const existingEmployeeJobs = await tx.employeeJobs.findMany();
      const existingRequests = await tx.requests.findMany();

      // 2. Drop all the tables in the order of foreign key dependencies
      await tx.edges.deleteMany();
      await tx.requests.deleteMany();
      await tx.employeeJobs.deleteMany();
      await tx.employees.deleteMany();
      await tx.nodes.deleteMany();

      // 3. Re-seed the database
      await tx.nodes.createMany({
        data: existingNodes,
      });

      await tx.edges.createMany({
        data: existingEdges,
      });

      await tx.employees.createMany({
        data: newEmployees as unknown as Prisma.EmployeesCreateManyInput,
      });

      await tx.employeeJobs.createMany({
        data: existingEmployeeJobs,
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

export default router;
