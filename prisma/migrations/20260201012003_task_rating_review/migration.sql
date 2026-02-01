-- AlterTable
ALTER TABLE "projectThesis" ADD COLUMN     "feedback" TEXT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "progressPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratting" INTEGER NOT NULL DEFAULT 0;
