/*
  Warnings:

  - The values [success] on the enum `PostStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostStatus_new" AS ENUM ('published', 'draft', 'scheduled');
ALTER TABLE "Post" ALTER COLUMN "status" TYPE "PostStatus_new" USING ("status"::text::"PostStatus_new");
ALTER TYPE "PostStatus" RENAME TO "PostStatus_old";
ALTER TYPE "PostStatus_new" RENAME TO "PostStatus";
DROP TYPE "PostStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "scheduledFor" TEXT;
