/*
  Warnings:

  - You are about to alter the column `lat` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `long` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to drop the column `endDate` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `changeQty` on the `stock_journals` table. All the data in the column will be lost.
  - You are about to drop the column `fromStockId` on the `stock_journals` table. All the data in the column will be lost.
  - You are about to drop the column `toStockId` on the `stock_journals` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `stores` table. All the data in the column will be lost.
  - You are about to alter the column `lat` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `long` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - The values [EMPLOYEE,ADMIN] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeAdminId]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountLimit` to the `discounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `stock_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `stock_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `stock_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `stock_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `stock_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `stock_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_userId_fkey`;

-- DropForeignKey
ALTER TABLE `stock_journals` DROP FOREIGN KEY `stock_journals_fromStockId_fkey`;

-- DropForeignKey
ALTER TABLE `stock_journals` DROP FOREIGN KEY `stock_journals_toStockId_fkey`;

-- DropForeignKey
ALTER TABLE `stocks` DROP FOREIGN KEY `stocks_productId_fkey`;

-- DropForeignKey
ALTER TABLE `stocks` DROP FOREIGN KEY `stocks_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `stores` DROP FOREIGN KEY `stores_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_addressId_fkey`;

-- AlterTable
ALTER TABLE `addresses` ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `lat` DOUBLE NOT NULL,
    MODIFY `long` DOUBLE NOT NULL,
    MODIFY `isPrimary` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `isDelete` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `cities` ADD COLUMN `storeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `discounts` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`,
    ADD COLUMN `discountLimit` DOUBLE NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `product_images` DROP COLUMN `image`,
    ADD COLUMN `images` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `isDelete` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `stock_journals` DROP COLUMN `changeQty`,
    DROP COLUMN `fromStockId`,
    DROP COLUMN `toStockId`,
    ADD COLUMN `fromStoreId` INTEGER NULL,
    ADD COLUMN `isRead` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `productId` INTEGER NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `storeId` INTEGER NOT NULL,
    ADD COLUMN `toStoreId` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `stores` DROP COLUMN `city`,
    DROP COLUMN `employeeId`,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    ADD COLUMN `qty` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `storeAdminId` INTEGER NULL,
    MODIFY `lat` DOUBLE NOT NULL,
    MODIFY `long` DOUBLE NOT NULL,
    MODIFY `isPrimary` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isDelete` BOOLEAN NULL DEFAULT false,
    MODIFY `role` ENUM('USER', 'STOREADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `employees`;

-- DropTable
DROP TABLE `stocks`;

-- CreateTable
CREATE TABLE `store_admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nip` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `store_admin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qty` INTEGER NOT NULL,
    `storeId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `store_products_storeId_productId_key`(`storeId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journal_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockJournalId` INTEGER NOT NULL,
    `toStoreId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qty` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `productId` INTEGER NOT NULL,
    `storeId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `products_name_key` ON `products`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `stores_storeAdminId_key` ON `stores`(`storeAdminId`);

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_admin` ADD CONSTRAINT `store_admin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_storeAdminId_fkey` FOREIGN KEY (`storeAdminId`) REFERENCES `store_admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_products` ADD CONSTRAINT `store_products_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_products` ADD CONSTRAINT `store_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_journals` ADD CONSTRAINT `stock_journals_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_journals` ADD CONSTRAINT `stock_journals_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_detail` ADD CONSTRAINT `journal_detail_stockJournalId_fkey` FOREIGN KEY (`stockJournalId`) REFERENCES `stock_journals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_detail` ADD CONSTRAINT `journal_detail_toStoreId_fkey` FOREIGN KEY (`toStoreId`) REFERENCES `stores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
