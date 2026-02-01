/*
  Warnings:

  - Made the column `semester` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "students" ALTER COLUMN "semester" SET NOT NULL;
