/*
  Warnings:

  - Added the required column `timezone` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "timezone" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Film" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "customer_id" INTEGER NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmCategory" (
    "film_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "FilmCategory_pkey" PRIMARY KEY ("film_id","category_id")
);

-- CreateTable
CREATE TABLE "RentalFilm" (
    "rental_id" INTEGER NOT NULL,
    "film_id" INTEGER NOT NULL,

    CONSTRAINT "RentalFilm_pkey" PRIMARY KEY ("rental_id","film_id")
);

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmCategory" ADD CONSTRAINT "FilmCategory_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmCategory" ADD CONSTRAINT "FilmCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalFilm" ADD CONSTRAINT "RentalFilm_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "Rental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalFilm" ADD CONSTRAINT "RentalFilm_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
