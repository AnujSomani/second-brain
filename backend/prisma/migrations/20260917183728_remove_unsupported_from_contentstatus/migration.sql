/*
  Warnings:

  - The values [unsupported] on the enum `ContentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentStatus_new" AS ENUM ('pending', 'processing', 'ready', 'failed');
ALTER TABLE "public"."Content" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Content" ALTER COLUMN "status" TYPE "ContentStatus_new" USING ("status"::text::"ContentStatus_new");
ALTER TYPE "ContentStatus" RENAME TO "ContentStatus_old";
ALTER TYPE "ContentStatus_new" RENAME TO "ContentStatus";
DROP TYPE "public"."ContentStatus_old";
ALTER TABLE "Content" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
