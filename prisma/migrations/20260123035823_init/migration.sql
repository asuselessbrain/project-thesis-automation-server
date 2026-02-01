/*
  Warnings:

  - The `status` column on the `students` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `notes` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `projectAndThesisId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `project_and_theses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_update_logs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectThesisId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectThesisType" AS ENUM ('PROJECT', 'THESIS');

-- CreateEnum
CREATE TYPE "ProjectThesisStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'in_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SemesterType" AS ENUM ('1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th');

-- DropForeignKey
ALTER TABLE "project_and_theses" DROP CONSTRAINT "project_and_theses_studentId_fkey";

-- DropForeignKey
ALTER TABLE "project_and_theses" DROP CONSTRAINT "project_and_theses_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "project_update_logs" DROP CONSTRAINT "project_update_logs_projectAndThesisId_fkey";

-- DropForeignKey
ALTER TABLE "project_update_logs" DROP CONSTRAINT "project_update_logs_taskId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectAndThesisId_fkey";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "notes",
DROP COLUMN "projectAndThesisId",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "projectThesisId" TEXT NOT NULL;

-- DropTable
DROP TABLE "project_and_theses";

-- DropTable
DROP TABLE "project_update_logs";

-- DropEnum
DROP TYPE "ProjectAndThesisStatus";

-- DropEnum
DROP TYPE "ProjectAndThesisType";

-- DropEnum
DROP TYPE "Semester";

-- CreateTable
CREATE TABLE "course_teachers" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "description" TEXT,
    "credits" DOUBLE PRECISION NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProjectThesisType" NOT NULL,
    "status" "ProjectThesisStatus" NOT NULL DEFAULT 'PENDING',
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "semester" "SemesterType" NOT NULL DEFAULT '1st',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_thesis_update_logs" (
    "id" TEXT NOT NULL,
    "projectThesisId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_thesis_update_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_teachers_courseId_teacherId_key" ON "course_teachers"("courseId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_courseCode_key" ON "courses"("courseCode");

-- AddForeignKey
ALTER TABLE "course_teachers" ADD CONSTRAINT "course_teachers_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_teachers" ADD CONSTRAINT "course_teachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_thesis_update_logs" ADD CONSTRAINT "project_thesis_update_logs_projectThesisId_fkey" FOREIGN KEY ("projectThesisId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_thesis_update_logs" ADD CONSTRAINT "project_thesis_update_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectThesisId_fkey" FOREIGN KEY ("projectThesisId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
