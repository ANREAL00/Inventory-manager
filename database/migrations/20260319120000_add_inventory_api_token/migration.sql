-- AlterTable
ALTER TABLE `Inventory` ADD COLUMN `apiToken` VARCHAR(128) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Inventory_apiToken_key` ON `Inventory`(`apiToken`);
