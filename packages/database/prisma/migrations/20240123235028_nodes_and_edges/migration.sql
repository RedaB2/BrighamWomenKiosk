-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('ELEV', 'REST', 'STAI', 'DEPT', 'LABS', 'INFO', 'CONF', 'EXIT', 'RETL', 'SERV');

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

    CONSTRAINT "Edges_pkey" PRIMARY KEY ("edgeID")
);
