-- CreateTable
CREATE TABLE "Game_Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "cloud_url" TEXT NOT NULL,

    CONSTRAINT "Game_Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "x_s" INTEGER NOT NULL,
    "x_e" INTEGER NOT NULL,
    "y_s" INTEGER NOT NULL,
    "y_e" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Game_Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
