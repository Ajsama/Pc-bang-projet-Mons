// Routes : écoutent les requêtes HTTP, vérifient les données, appellent le repository
// (elles jouent le rôle qu'avaient les « handlers » : recevoir la demande et renvoyer la réponse)
import { Router, Response } from "express";
import { Prisma, StatutPoste } from "../generated/prisma/client";
import { PosteRepository } from "../repositories/posteRepository";

const router = Router();
const repo = new PosteRepository();

const STATUTS = Object.values(StatutPoste);

// Vérifie les données reçues ; renvoie un message d'erreur, ou null si tout est correct
function verifierPoste(body: any, partiel = false): string | null {
  const { numero, type, tarifHoraire, statut } = body;
  if (!partiel || numero !== undefined) {
    if (!Number.isInteger(numero) || numero <= 0) return "Le numéro doit être un entier positif.";
  }
  if (!partiel || type !== undefined) {
    if (typeof type !== "string" || type.trim() === "") return "Le type est obligatoire.";
  }
  if (!partiel || tarifHoraire !== undefined) {
    if (typeof tarifHoraire !== "number" || tarifHoraire <= 0) return "Le tarif horaire doit être un nombre positif.";
  }
  if (statut !== undefined && !STATUTS.includes(statut)) return "Statut inconnu.";
  return null;
}

// Lit l'identifiant dans l'URL ; renvoie null s'il n'est pas valide
function lireId(param: string): number | null {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Traduit les erreurs Prisma les plus courantes en réponses HTTP claires
function gererErreur(erreur: unknown, res: Response) {
  if (erreur instanceof Prisma.PrismaClientKnownRequestError) {
    if (erreur.code === "P2002") return res.status(409).json({ message: "Ce numéro de poste existe déjà." });
    if (erreur.code === "P2025") return res.status(404).json({ message: "Poste introuvable." });
  }
  console.error(erreur);
  res.status(500).json({ message: "Erreur serveur." });
}

// GET /api/postes : liste de tous les postes
router.get("/", async (_req, res) => {
  try {
    res.json(await repo.getPostes());
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// GET /api/postes/:id : un poste précis
router.get("/:id", async (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Identifiant invalide." });
  try {
    const poste = await repo.getPosteById(id);
    if (!poste) return res.status(404).json({ message: "Poste introuvable." });
    res.json(poste);
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// POST /api/postes : ajouter un poste
router.post("/", async (req, res) => {
  const message = verifierPoste(req.body);
  if (message) return res.status(400).json({ message });
  try {
    const { numero, type, tarifHoraire, statut } = req.body;
    res.status(201).json(await repo.addPoste({ numero, type: type.trim(), tarifHoraire, statut }));
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// PUT /api/postes/:id : modifier un poste
router.put("/:id", async (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Identifiant invalide." });
  const message = verifierPoste(req.body, true);
  if (message) return res.status(400).json({ message });
  try {
    const { numero, type, tarifHoraire, statut } = req.body;
    res.json(await repo.updatePoste(id, { numero, type, tarifHoraire, statut }));
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// DELETE /api/postes/:id : supprimer un poste (rien à renvoyer : code 204)
router.delete("/:id", async (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Identifiant invalide." });
  try {
    await repo.deletePoste(id);
    res.status(204).send();
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

export default router;
