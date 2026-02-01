/*
  Warnings:

  - Made the column `semester` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "semester" SET NOT NULL;
