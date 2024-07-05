/*
  Warnings:

  - You are about to drop the column `addressId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `users_addressId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `products` MODIFY `description` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `addressId`;
