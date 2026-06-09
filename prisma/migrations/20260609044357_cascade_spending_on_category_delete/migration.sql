-- DropForeignKey
ALTER TABLE "Spending" DROP CONSTRAINT "Spending_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Spending" ADD CONSTRAINT "Spending_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
