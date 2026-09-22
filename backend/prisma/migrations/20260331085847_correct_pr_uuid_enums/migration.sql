/*
  Warnings:

  - The primary key for the `problems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `category` on the `problems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `difficulty` on the `problems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FRONTEND', 'BACKEND', 'ALGORITHMS', 'DATABASES', 'DEVOPS', 'SYSTEM_DESIGN');

-- AlterTable
ALTER TABLE "problems" DROP CONSTRAINT "problems_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ADD CONSTRAINT "problems_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "problems_id_seq";
