// Routes : écoutent les requêtes HTTP, vérifient les données, appellent le repository
import { Router, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { ClientRepository } from "../repositories/clientRepository";

const router = Router();
const repo = new ClientRepository();

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Vérifie un texte obligatoire (non vide, longueur maximale)
function texteValide(valeur: unknown, max: number) {
  return typeof valeur === "string" && valeur.trim() !== "" && valeur.trim().length <= max;
}

// Vérifie les données reçues ; renvoie un message d'erreur, ou null si tout est correct
function verifierClient(body: any, partiel = false): string | null {
  const { nom, prenom, email, telephone } = body;
  if (!partiel || nom !== undefined) {
    if (!texteValide(nom, 50)) return "Le nom est obligatoire (50 caractères maximum).";
  }
  if (!partiel || prenom !== undefined) {
    if (!texteValide(prenom, 50)) return "Le prénom est obligatoire (50 caractères maximum).";
  }
  if (!partiel || email !== undefined) {
    if (typeof email !== "string" || !EMAIL_VALIDE.test(email.trim())) return "L'adresse e-mail n'est pas valide.";
  }
  if (telephone !== undefined && telephone !== null && telephone !== "") {
    if (typeof telephone !== "string" || !/^[0-9+ ./-]{6,20}$/.test(telephone.trim())) {
      return "Le numéro de téléphone n'est pas valide.";
    }
  }
  return null;
}

// Nettoie les données reçues (espaces en trop, e-mail en minuscules)
function nettoyer(body: any) {
  const { nom, prenom, email, telephone } = body;
  return {
    nom: typeof nom === "string" ? nom.trim() : undefined,
    prenom: typeof prenom === "string" ? prenom.trim() : undefined,
    email: typeof email === "string" ? email.trim().toLowerCase() : undefined,
    telephone: telephone === undefined ? undefined : telephone ? String(telephone).trim() : null,
  };
}

// Lit l'identifiant dans l'URL ; renvoie null s'il n'est pas valide
function lireId(param: string): number | null {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Traduit les erreurs Prisma les plus courantes en réponses HTTP claires
function gererErreur(erreur: unknown, res: Response) {
  if (erreur instanceof Prisma.PrismaClientKnownRequestError) {
    if (erreur.code === "P2002") return res.status(409).json({ message: "Cette adresse e-mail est déjà utilisée." });
    if (erreur.code === "P2025") return res.status(404).json({ message: "Client introuvable." });
  }
  console.error(erreur);
  res.status(500).json({ message: "Erreur serveur." });
}

// GET /api/clients : liste de tous les clients
router.get("/", async (_req, res) => {
  try {
    res.json(await repo.getClients());
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// GET /api/clients/:id : un client précis
router.get("/:id", async (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Identifiant invalide." });
  try {
    const client = await repo.getClientById(id);
    if (!client) return res.status(404).json({ message: "Client introuvable." });
    res.json(client);
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// POST /api/clients : ajouter un client
router.post("/", async (req, res) => {
  const message = verifierClient(req.body);
  if (message) return res.status(400).json({ message });
  try {
    const { nom, prenom, email, telephone } = nettoyer(req.body);
    res.status(201).json(await repo.addClient({ nom: nom!, prenom: prenom!, email: email!, telephone }));
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// PUT /api/clients/:id : modifier un client
router.put("/:id", async (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Identifiant invalide." });
  const message = verifierClient(req.body, true);
  if (message) return res.status(400).json({ message });
  try {
    res.json(await repo.updateClient(id, nettoyer(req.body)));
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

// DELETE /api/clients/:id : supprimer un client (rien à renvoyer : code 204)
router.delete("/:id", async (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Identifiant invalide." });
  try {
    await repo.deleteClient(id);
    res.status(204).send();
  } catch (erreur) {
    gererErreur(erreur, res);
  }
});

export default router;
