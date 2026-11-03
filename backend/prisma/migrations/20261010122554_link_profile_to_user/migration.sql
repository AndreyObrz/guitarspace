/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "bio" SET DEFAULT '',
ALTER COLUMN "points" SET DEFAULT 0,
ALTER COLUMN "rank" SET DEFAULT 0,
ALTER COLUMN "rankLabel" SET DEFAULT 'Новичок',
ALTER COLUMN "publications" SET DEFAULT 0,
ALTER COLUMN "earnings" SET DEFAULT 0,
ALTER COLUMN "progressCurrent" SET DEFAULT 0,
ALTER COLUMN "progressTarget" SET DEFAULT 100,
ALTER COLUMN "progressLabel" SET DEFAULT 'Ученик';

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
