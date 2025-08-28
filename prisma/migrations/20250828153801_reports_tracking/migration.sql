-- AlterTable
ALTER TABLE "public"."reports" ADD COLUMN     "reporter_city" VARCHAR(100),
ADD COLUMN     "reporter_country" VARCHAR(2),
ADD COLUMN     "reporter_ip" VARCHAR(45),
ADD COLUMN     "reporter_timezone" VARCHAR(50),
ADD COLUMN     "reporter_user_agent" VARCHAR(500);

-- CreateIndex
CREATE INDEX "idx_reports_reporter_ip" ON "public"."reports"("reporter_ip");

-- CreateIndex
CREATE INDEX "idx_reports_reporter_country" ON "public"."reports"("reporter_country");
