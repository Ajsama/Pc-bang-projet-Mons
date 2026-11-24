// Données de démonstration : remplit les tables des postes et des clients
import "dotenv/config";
import bcrypt from "bcryptjs";
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

  // Clients : on supprime d'abord les utilisateurs qui sont des clients (la suppression se propage au client)
  await prisma.utilisateur.deleteMany({ where: { client: { isNot: null } } });

  // Mot de passe de démonstration, stocké haché comme en production
  const motDePasseHash = await bcrypt.hash("demo1234", 10);

  const clients = [
    { nom: "Dupont", prenom: "Lucas", email: "lucas.dupont@mail.be", telephone: "0470 12 34 56" },
    { nom: "Martin", prenom: "Emma", email: "emma.martin@mail.be", telephone: "0485 22 33 44" },
    { nom: "Lambert", prenom: "Noah", email: "noah.lambert@mail.be", telephone: null },
    { nom: "Dubois", prenom: "Léa", email: "lea.dubois@mail.be", telephone: "0496 55 66 77" },
    { nom: "Peeters", prenom: "Liam", email: "liam.peeters@mail.be", telephone: "0472 88 99 00" },
  ];

  for (const c of clients) {
    await prisma.client.create({
      data: {
        telephone: c.telephone,
        utilisateur: { create: { nom: c.nom, prenom: c.prenom, email: c.email, motDePasseHash } },
      },
    });
  }

  console.log("Données de démonstration ajoutées : 10 postes et 5 clients");
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
