/*
  Warnings:

  - The values [LOWU,MEDI] on the enum `Urgency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nodeID` on the `Requests` table. All the data in the column will be lost.
  - Added the required column `weight` to the `Edges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeId` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('REGULAR', 'ADMIN');

-- AlterEnum
ALTER TYPE "NodeType" ADD VALUE 'BATH';

-- AlterEnum
ALTER TYPE "RequestType" ADD VALUE 'CUST';

-- AlterEnum
BEGIN;
CREATE TYPE "Urgency_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "Requests" ALTER COLUMN "urgency" TYPE "Urgency_new" USING ("urgency"::text::"Urgency_new");
ALTER TYPE "Urgency" RENAME TO "Urgency_old";
ALTER TYPE "Urgency_new" RENAME TO "Urgency";
DROP TYPE "Urgency_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_nodeID_fkey";

-- AlterTable
ALTER TABLE "Edges" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Requests" DROP COLUMN "nodeID",
ADD COLUMN     "completionStatus" "RequestStatus" NOT NULL DEFAULT 'UNASSIGNED',
ADD COLUMN     "employeeId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nodeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Employees" (
    "id" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Nodes"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
