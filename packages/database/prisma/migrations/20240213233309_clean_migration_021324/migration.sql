-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('ELEV', 'REST', 'STAI', 'DEPT', 'LABS', 'INFO', 'CONF', 'EXIT', 'RETL', 'SERV', 'HALL', 'BATH');

-- CreateEnum
CREATE TYPE "EmployeeJob" AS ENUM ('NULL', 'JANITOR', 'DOCTOR', 'NURSE', 'OFFICE_ADMIN');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('ADMIN', 'REGULAR');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('JANI', 'MECH', 'MEDI', 'RELC', 'CONS', 'CUST');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('ELEC', 'PLUM', 'LOCK', 'TECH');

-- CreateEnum
CREATE TYPE "MedicalDepartment" AS ENUM ('NEURO', 'ORTHO', 'PEDIA', 'CARDI', 'ONCOL', 'INTER');

-- CreateTable
CREATE TABLE "Nodes" (
    "nodeID" TEXT NOT NULL,
    "xcoord" INTEGER NOT NULL,
    "ycoord" INTEGER NOT NULL,
    "floor" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "nodeType" "NodeType" NOT NULL,
    "longName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "Nodes_pkey" PRIMARY KEY ("nodeID")
);

-- CreateTable
CREATE TABLE "Edges" (
    "edgeID" TEXT NOT NULL,
    "startNode" TEXT NOT NULL,
    "endNode" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Edges_pkey" PRIMARY KEY ("edgeID")
);

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeJobs" (
    "employeeId" INTEGER NOT NULL,
    "job" "EmployeeJob" NOT NULL,

    CONSTRAINT "EmployeeJobs_pkey" PRIMARY KEY ("employeeId","job")
);

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "nodeID" TEXT NOT NULL,
    "employeeID" INTEGER NOT NULL,
    "urgency" "Urgency" NOT NULL,
    "type" "RequestType" NOT NULL,
    "notes" TEXT,
    "completionStatus" "RequestStatus" NOT NULL DEFAULT 'UNASSIGNED',
    "medicineName" TEXT,
    "medicineDosage" TEXT,
    "maintenanceType" "MaintenanceType",
    "roomTo" TEXT,
    "hazardousWaste" BOOLEAN,
    "department" "MedicalDepartment",

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmployeeJobs" ADD CONSTRAINT "EmployeeJobs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_nodeID_fkey" FOREIGN KEY ("nodeID") REFERENCES "Nodes"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_roomTo_fkey" FOREIGN KEY ("roomTo") REFERENCES "Nodes"("nodeID") ON DELETE SET NULL ON UPDATE CASCADE;
