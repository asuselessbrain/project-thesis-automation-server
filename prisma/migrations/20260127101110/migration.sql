/*
  Warnings:

  - You are about to drop the column `note` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "note",
ADD COLUMN     "requirements" TEXT[];
