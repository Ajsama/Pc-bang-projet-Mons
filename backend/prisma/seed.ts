// Données de démonstration : remplit la table des postes
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  // On vide la table pour pouvoir relancer le seed plusieurs fois
  await prisma.poste.deleteMany();

  await prisma.poste.createMany({
    data: [
      { numero: 1, type: "Standard", tarifHoraire: 3.5, statut: "DISPONIBLE" },
      { numero: 2, type: "Standard", tarifHoraire: 3.5, statut: "OCCUPE" },
      { numero: 3, type: "Standard", tarifHoraire: 3.5, statut: "DISPONIBLE" },
      { numero: 4, type: "Standard", tarifHoraire: 3.5, statut: "DISPONIBLE" },
      { numero: 5, type: "Standard", tarifHoraire: 3.5, statut: "MAINTENANCE" },
      { numero: 6, type: "Standard", tarifHoraire: 3.5, statut: "OCCUPE" },
      { numero: 7, type: "Premium", tarifHoraire: 5, statut: "DISPONIBLE" },
      { numero: 8, type: "Premium", tarifHoraire: 5, statut: "OCCUPE" },
      { numero: 9, type: "Premium", tarifHoraire: 5, statut: "DISPONIBLE" },
      { numero: 10, type: "Premium", tarifHoraire: 5, statut: "HORS_SERVICE" },
    ],
  });

  console.log("Données de démonstration ajoutées : 10 postes");
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
