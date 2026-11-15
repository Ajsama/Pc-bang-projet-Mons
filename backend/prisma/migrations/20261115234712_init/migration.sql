-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYE', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutPoste" AS ENUM ('DISPONIBLE', 'OCCUPE', 'MAINTENANCE', 'HORS_SERVICE');

-- CreateTable
CREATE TABLE "utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mot_de_passe_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id_utilisateur" INTEGER NOT NULL,
    "telephone" VARCHAR(20),
    "date_fin_abonnement" DATE,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "employe" (
    "id_utilisateur" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYE',

    CONSTRAINT "employe_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "poste" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "tarif_horaire" DECIMAL(6,2) NOT NULL,
    "statut" "StatutPoste" NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "poste_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "poste_numero_key" ON "poste"("numero");

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employe" ADD CONSTRAINT "employe_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
