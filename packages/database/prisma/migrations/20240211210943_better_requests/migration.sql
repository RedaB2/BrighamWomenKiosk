-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('ELEC', 'PLUM', 'LOCK', 'TECH');

-- AlterEnum
ALTER TYPE "Urgency" ADD VALUE 'EMERGENCY';

-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "maintenanceType" "MaintenanceType",
ADD COLUMN     "medicineDosage" TEXT,
ADD COLUMN     "medicineName" TEXT,
ADD COLUMN     "roomTo" TEXT;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_roomTo_fkey" FOREIGN KEY ("roomTo") REFERENCES "Nodes"("nodeID") ON DELETE SET NULL ON UPDATE CASCADE;
