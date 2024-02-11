/*
  Warnings:

  - The values [NULL,OFFICEADMIN] on the enum `EmployeeJob` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeJob_new" AS ENUM ('JANITOR', 'DOCTOR', 'NURSE', 'OFFICE_ADMIN');
ALTER TABLE "EmployeeJobs" ALTER COLUMN "job" TYPE "EmployeeJob_new" USING ("job"::text::"EmployeeJob_new");
ALTER TYPE "EmployeeJob" RENAME TO "EmployeeJob_old";
ALTER TYPE "EmployeeJob_new" RENAME TO "EmployeeJob";
DROP TYPE "EmployeeJob_old";
COMMIT;
