-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "ballColor" TEXT NOT NULL DEFAULT 'yellow',
ADD COLUMN     "subcategory" TEXT;

-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "isOver" BOOLEAN NOT NULL DEFAULT false;
