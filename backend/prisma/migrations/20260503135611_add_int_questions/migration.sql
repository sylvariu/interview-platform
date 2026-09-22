-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "currentIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "questions" JSONB NOT NULL DEFAULT '[]';
