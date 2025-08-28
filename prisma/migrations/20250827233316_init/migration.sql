-- CreateTable
CREATE TABLE "public"."reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone_number" VARCHAR(64) NOT NULL,
    "reason" VARCHAR(100) NOT NULL,
    "custom_reason" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_stats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "total_reports" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_reports_phone_hash" ON "public"."reports"("phone_number");

-- CreateIndex
CREATE INDEX "idx_reports_created_at" ON "public"."reports"("created_at");

-- CreateIndex
CREATE INDEX "idx_reports_phone_created" ON "public"."reports"("phone_number", "created_at");

-- CreateIndex
CREATE INDEX "idx_reports_reason" ON "public"."reports"("reason");

-- CreateIndex
CREATE INDEX "idx_reports_custom_reason" ON "public"."reports"("custom_reason");
