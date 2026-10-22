-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "photo" BYTEA,
ADD COLUMN     "photoType" TEXT,
ADD COLUMN     "photoUpdatedAt" TIMESTAMP(3);
