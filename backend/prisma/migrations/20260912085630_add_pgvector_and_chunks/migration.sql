-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('pending', 'processing', 'ready', 'failed', 'unsupported');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "extractedText" TEXT,
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Chunk" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" vector(1536),
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "Chunk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
