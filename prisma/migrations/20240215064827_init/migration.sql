/*
  Warnings:

  - Added the required column `blog` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tittle` to the `blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "blog" TEXT NOT NULL,
ADD COLUMN     "tittle" TEXT NOT NULL;
