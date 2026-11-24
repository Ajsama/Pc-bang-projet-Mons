import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import posteRoutes from "./routes/posteRoutes";
import clientRoutes from "./routes/clientRoutes";

const app = express();

// Autorise uniquement le front-end Angular à appeler l'API
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:4200" }));

// Permet de lire le JSON envoyé dans le corps des requêtes
app.use(express.json());

// Route de test : vérifie que l'API répond et que la base de données est joignable
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", message: "API PC Bang Manager opérationnelle", database: "connectée" });
  } catch {
    res.status(503).json({ status: "erreur", message: "Base de données injoignable", database: "déconnectée" });
  }
});

// Routes des postes (CRUD)
app.use("/api/postes", posteRoutes);

// Routes des clients (CRUD)
app.use("/api/clients", clientRoutes);

export default app;
