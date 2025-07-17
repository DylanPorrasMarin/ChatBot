-- CreateTable
CREATE TABLE "DefaultAnswer" (
    "id" SERIAL NOT NULL,
    "keywords" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DefaultAnswer_pkey" PRIMARY KEY ("id")
);
