import express from "express";
import cors from "cors";

const app = express();

// Autorise uniquement le front-end Angular à appeler l'API
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:4200" }));

// Permet de lire le JSON envoyé dans le corps des requêtes
app.use(express.json());

// Route de test : vérifie que l'API répond
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "API PC Bang Manager opérationnelle" });
});

export default app;
