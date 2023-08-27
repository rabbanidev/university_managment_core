-- AlterTable
ALTER TABLE "semeter_registrations" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
