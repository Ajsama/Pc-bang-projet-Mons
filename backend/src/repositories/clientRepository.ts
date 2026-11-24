// Repository : le SEUL endroit qui parle à la base de données pour les clients (via Prisma)
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

// DTO = forme des données envoyées par l'interface
export interface ClientCreateDto {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
}
export type ClientUpdateDto = Partial<ClientCreateDto>;

// Un client EST un utilisateur (héritage) : on ramène aussi ses infos d'utilisateur.
// « select » choisit les champs renvoyés : le mot de passe haché ne sort JAMAIS de l'API.
const AVEC_UTILISATEUR = {
  utilisateur: { select: { nom: true, prenom: true, email: true, createdAt: true } },
} as const;

// Transforme le résultat Prisma (client + utilisateur imbriqué) en un objet simple pour l'interface
function versClient(c: {
  utilisateurId: number;
  telephone: string | null;
  dateFinAbonnement: Date | null;
  utilisateur: { nom: string; prenom: string; email: string; createdAt: Date };
}) {
  return {
    id: c.utilisateurId,
    nom: c.utilisateur.nom,
    prenom: c.utilisateur.prenom,
    email: c.utilisateur.email,
    telephone: c.telephone,
    dateFinAbonnement: c.dateFinAbonnement,
    createdAt: c.utilisateur.createdAt,
  };
}

export class ClientRepository {
  private db = prisma;

  // SELECT ... FROM client JOIN utilisateur ... ORDER BY nom
  async getClients() {
    const clients = await this.db.client.findMany({
      include: AVEC_UTILISATEUR,
      orderBy: { utilisateur: { nom: "asc" } },
    });
    return clients.map(versClient);
  }

  async getClientById(id: number) {
    const client = await this.db.client.findUnique({
      where: { utilisateurId: id },
      include: AVEC_UTILISATEUR,
    });
    return client ? versClient(client) : null;
  }

  // Crée l'utilisateur ET le client en une seule requête (création imbriquée)
  async addClient(dto: ClientCreateDto) {
    // Le client créé à l'accueil reçoit un mot de passe provisoire aléatoire, stocké HACHÉ (bcrypt).
    // Il pourra choisir son propre mot de passe quand l'authentification sera en place.
    const motDePasseProvisoire = randomBytes(8).toString("hex");
    const motDePasseHash = await bcrypt.hash(motDePasseProvisoire, 10);

    const client = await this.db.client.create({
      data: {
        telephone: dto.telephone ?? null,
        utilisateur: {
          create: { nom: dto.nom, prenom: dto.prenom, email: dto.email, motDePasseHash },
        },
      },
      include: AVEC_UTILISATEUR,
    });
    return versClient(client);
  }

  // UPDATE client + UPDATE utilisateur
  async updateClient(id: number, dto: ClientUpdateDto) {
    const client = await this.db.client.update({
      where: { utilisateurId: id },
      data: {
        telephone: dto.telephone,
        utilisateur: { update: { nom: dto.nom, prenom: dto.prenom, email: dto.email } },
      },
      include: AVEC_UTILISATEUR,
    });
    return versClient(client);
  }

  // Supprime le client PUIS son utilisateur dans une transaction : tout ou rien
  async deleteClient(id: number): Promise<void> {
    await this.db.$transaction([
      this.db.client.delete({ where: { utilisateurId: id } }),
      this.db.utilisateur.delete({ where: { id } }),
    ]);
  }
}
