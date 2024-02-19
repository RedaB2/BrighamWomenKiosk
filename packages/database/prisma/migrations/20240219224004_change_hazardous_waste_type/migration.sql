/*
  Warnings:

  - The `hazardousWaste` column on the `Requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "EmployeeJobs" DROP CONSTRAINT "EmployeeJobs_employeeId_fkey";

-- AlterTable
ALTER TABLE "Requests" DROP COLUMN "hazardousWaste",
ADD COLUMN     "hazardousWaste" BOOLEAN;

-- AddForeignKey
ALTER TABLE "EmployeeJobs" ADD CONSTRAINT "EmployeeJobs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
