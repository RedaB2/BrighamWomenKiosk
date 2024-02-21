-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_employeeID_fkey";

-- AlterTable
ALTER TABLE "Requests" ALTER COLUMN "employeeID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
