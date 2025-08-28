/*
  Warnings:

  - You are about to alter the column `phone_number` on the `reports` table. The data in that column could be lost. The data in that column will be cast from `VarChar(64)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "public"."reports" ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(20);

-- RenameIndex
ALTER INDEX "public"."idx_reports_phone_hash" RENAME TO "idx_reports_phone";
