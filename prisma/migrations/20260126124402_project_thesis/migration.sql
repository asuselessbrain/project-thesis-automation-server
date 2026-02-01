/*
  Warnings:

  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "project_thesis_update_logs" DROP CONSTRAINT "project_thesis_update_logs_projectThesisId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_courseId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_studentId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectThesisId_fkey";

-- DropTable
DROP TABLE "projects";

-- CreateTable
CREATE TABLE "projectThesis" (
    "id" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "projectObjectives" TEXT NOT NULL,
    "methodology" TEXT NOT NULL,
    "expectedOutcomes" TEXT NOT NULL,
    "technologiesTools" TEXT[],
    "estimatedTimeline" TEXT NOT NULL,
    "attachments" TEXT[],
    "type" "ProjectThesisType" NOT NULL,
    "status" "ProjectThesisStatus" NOT NULL DEFAULT 'PENDING',
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "semester" "SemesterType" NOT NULL DEFAULT '1st',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projectThesis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projectThesis" ADD CONSTRAINT "projectThesis_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectThesis" ADD CONSTRAINT "projectThesis_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectThesis" ADD CONSTRAINT "projectThesis_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_thesis_update_logs" ADD CONSTRAINT "project_thesis_update_logs_projectThesisId_fkey" FOREIGN KEY ("projectThesisId") REFERENCES "projectThesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectThesisId_fkey" FOREIGN KEY ("projectThesisId") REFERENCES "projectThesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
