/*
  Warnings:

  - You are about to drop the column `description` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `projects` table. All the data in the column will be lost.
  - Added the required column `abstract` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedTimeline` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedOutcomes` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `methodology` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectObjectives` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectTitle` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "abstract" TEXT NOT NULL,
ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "estimatedTimeline" TEXT NOT NULL,
ADD COLUMN     "expectedOutcomes" TEXT NOT NULL,
ADD COLUMN     "methodology" TEXT NOT NULL,
ADD COLUMN     "projectObjectives" TEXT NOT NULL,
ADD COLUMN     "projectTitle" TEXT NOT NULL,
ADD COLUMN     "technologiesTools" TEXT[];
