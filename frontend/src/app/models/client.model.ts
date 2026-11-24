// Forme d'un client, tel que l'API le renvoie (le mot de passe n'est jamais envoyé)
export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  dateFinAbonnement: string | null;
  createdAt: string;
}

// DTO (Data Transfer Object) : forme des données envoyées à l'API
// Création : un Client sans l'id ni les dates (gérés par la base)
export interface ClientCreateDto {
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
}

// Modification : les mêmes champs, tous optionnels
export type ClientUpdateDto = Partial<ClientCreateDto>;
