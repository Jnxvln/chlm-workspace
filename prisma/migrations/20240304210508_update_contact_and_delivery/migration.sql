/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryAddress` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `directions` on the `Delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "coordinates",
DROP COLUMN "deliveryAddress",
DROP COLUMN "directions";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "directions" TEXT;
