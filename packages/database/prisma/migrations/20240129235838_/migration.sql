-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOWU', 'MEDI', 'HIGH');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('JANI', 'MECH', 'MEDI', 'RELC', 'CONS');

-- AlterEnum
ALTER TYPE "NodeType" ADD VALUE 'HALL';

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "nodeID" TEXT NOT NULL,
    "urgency" "Urgency" NOT NULL,
    "type" "RequestType" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_nodeID_fkey" FOREIGN KEY ("nodeID") REFERENCES "Nodes"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;
