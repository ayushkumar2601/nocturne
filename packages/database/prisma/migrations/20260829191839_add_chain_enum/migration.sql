-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('ethereum', 'midnight');

-- AlterTable
ALTER TABLE "TransactionAudit" ADD COLUMN     "chain" "Chain" NOT NULL DEFAULT 'ethereum';

-- AlterTable
ALTER TABLE "TransactionDraft" ADD COLUMN     "chain" "Chain" NOT NULL DEFAULT 'ethereum';
