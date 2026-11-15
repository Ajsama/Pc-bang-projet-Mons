// Repository : le SEUL endroit qui parle à la base de données pour les postes (via Prisma)
import { prisma } from "../lib/prisma";
import { StatutPoste } from "../generated/prisma/client";

// DTO = forme des données envoyées par l'interface
export interface PosteCreateDto {
  numero: number;
  type: string;
  tarifHoraire: number;
  statut?: StatutPoste;
}
export type PosteUpdateDto = Partial<PosteCreateDto>;

export class PosteRepository {
  private db = prisma;

  // SELECT * FROM poste ORDER BY numero
  async getPostes() {
    return this.db.poste.findMany({ orderBy: { numero: "asc" } });
  }

  // SELECT * FROM poste WHERE id = ?
  async getPosteById(id: number) {
    return this.db.poste.findUnique({ where: { id } });
  }

  // INSERT INTO poste (...) VALUES (...)
  async addPoste(dto: PosteCreateDto) {
    return this.db.poste.create({ data: dto });
  }

  // UPDATE poste SET ... WHERE id = ?
  async updatePoste(id: number, dto: PosteUpdateDto) {
    return this.db.poste.update({ where: { id }, data: dto });
  }

  // DELETE FROM poste WHERE id = ?
  async deletePoste(id: number): Promise<void> {
    await this.db.poste.delete({ where: { id } });
  }
}
