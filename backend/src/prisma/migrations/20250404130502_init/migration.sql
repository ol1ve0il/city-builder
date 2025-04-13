/*
  Warnings:

  - You are about to drop the column `name` on the `Building` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Building" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" REAL NOT NULL,
    "z" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "depth" REAL NOT NULL,
    "color" TEXT,
    "modelUrl" TEXT,
    "rotation" REAL,
    "type" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "Building_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Building" ("cityId", "color", "depth", "height", "id", "modelUrl", "rotation", "type", "width", "x", "z") SELECT "cityId", "color", "depth", "height", "id", "modelUrl", "rotation", "type", "width", "x", "z" FROM "Building";
DROP TABLE "Building";
ALTER TABLE "new_Building" RENAME TO "Building";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
