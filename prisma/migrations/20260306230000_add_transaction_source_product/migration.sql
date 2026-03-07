-- AlterTable: Add source and product fields to transactions
-- source: identifies the payment gateway ('ABACATE' or 'KIWIFY')
-- product: identifies the specific product purchased

ALTER TABLE "transactions" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'ABACATE';
ALTER TABLE "transactions" ADD COLUMN "product" TEXT;

-- Create indexes for common query patterns
CREATE INDEX "transactions_source_idx" ON "transactions"("source");
CREATE INDEX "transactions_product_idx" ON "transactions"("product");
