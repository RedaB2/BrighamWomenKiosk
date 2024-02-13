/*
  Warnings:

  - You are about to drop the column `login` on the `Employees` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `Requests` table. All the data in the column will be lost.
  - You are about to drop the column `nodeId` on the `Requests` table. All the data in the column will be lost.
  - Added the required column `username` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `employeeID` to the `Requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeID` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeJob" AS ENUM ('NULL', 'JANITOR', 'DOCTOR', 'NURSE', 'OFFICEADMIN');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('ADMIN', 'REGULAR');

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_nodeId_fkey";

-- AlterTable
CREATE SEQUENCE employees_id_seq;
ALTER TABLE "Employees" DROP COLUMN "login",
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('employees_id_seq'),
DROP COLUMN "role",
ADD COLUMN     "role" "EmployeeRole" NOT NULL;
ALTER SEQUENCE employees_id_seq OWNED BY "Employees"."id";

-- AlterTable
ALTER TABLE "Requests" DROP COLUMN "employeeId",
DROP COLUMN "nodeId",
ADD COLUMN     "employeeID" INTEGER NOT NULL,
ADD COLUMN     "nodeID" TEXT NOT NULL;

-- DropEnum
DROP TYPE "StaffRole";

-- CreateTable
CREATE TABLE "EmployeeJobs" (
    "employeeId" INTEGER NOT NULL,
    "job" "EmployeeJob" NOT NULL,

    CONSTRAINT "EmployeeJobs_pkey" PRIMARY KEY ("employeeId","job")
);

-- AddForeignKey
ALTER TABLE "EmployeeJobs" ADD CONSTRAINT "EmployeeJobs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_nodeID_fkey" FOREIGN KEY ("nodeID") REFERENCES "Nodes"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
