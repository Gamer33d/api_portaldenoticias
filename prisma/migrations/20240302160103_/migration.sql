/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatarUrl` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "news" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
