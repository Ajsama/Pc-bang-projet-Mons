# PC Bang Manager

Application de gestion d'un PC Bang (cyber-café gaming) : réservation de postes, suivi des sessions de jeu, commandes de snacks et boissons, abonnements et suivi des recettes.

Projet réalisé dans le cadre du cours de **Projet d'intégration de développement** (2026-2027).

## Stack technique

| Couche | Technologie |
|---|---|
| Front-end | Angular (TypeScript) |
| Back-end | Node.js + Express (TypeScript) |
| Accès aux données | Prisma (ORM) |
| Base de données | PostgreSQL |
| Application desktop (optionnel) | Electron |

## Structure du dépôt

```
.
├── backend/    API REST (Node.js / Express / Prisma)
│   ├── prisma/           schéma de la base, migrations, données de démo
│   └── src/
│       ├── routes/       reçoivent les requêtes HTTP et valident les données
│       ├── repositories/ accès à la base de données (Prisma)
│       └── lib/          connexion Prisma
├── frontend/   Interface utilisateur (Angular)
│   └── src/app/
│       ├── components/   composants (liste, carte, formulaire)
│       ├── services/     appels à l'API
│       └── models/       types de données (DTO)
└── docs/       Dossier d'analyse, rapports hebdomadaires
```

## Trajet d'une action

```
Composant → Service Angular → requête HTTP → Route Express → Repository (Prisma) → PostgreSQL
```

La réponse remonte ensuite dans l'autre sens.

## Installation

### Prérequis

- Node.js 20 ou plus récent
- PostgreSQL

### 1. Base de données

```bash
psql postgres -c "CREATE USER pcbang WITH PASSWORD 'pcbang' CREATEDB;"
createdb -O pcbang pcbang
```

### 2. Back-end

```bash
cd backend
cp .env.example .env        # puis adapter les valeurs si besoin
npm install
npx prisma migrate dev      # crée les tables
npx prisma db seed          # ajoute les données de démonstration
npm run dev                 # API sur http://localhost:3000
```

### 3. Front-end

```bash
cd frontend
npm install
npm start                   # interface sur http://localhost:4200
```

## Routes de l'API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/health` | Vérifie que l'API et la base de données répondent |
| GET | `/api/postes` | Liste des postes |
| GET | `/api/postes/:id` | Détail d'un poste |
| POST | `/api/postes` | Création d'un poste |
| PUT | `/api/postes/:id` | Modification d'un poste |
| DELETE | `/api/postes/:id` | Suppression d'un poste |
| GET | `/api/clients` | Liste des clients |
| GET | `/api/clients/:id` | Détail d'un client |
| POST | `/api/clients` | Création d'un client (avec son compte utilisateur) |
| PUT | `/api/clients/:id` | Modification d'un client |
| DELETE | `/api/clients/:id` | Suppression d'un client |

## Avancement

- [x] Initialisation du dépôt et de la structure du projet
- [x] Mise en place du back-end (Express + TypeScript)
- [x] Base de données : Prisma + PostgreSQL, premières tables, données de démonstration
- [x] Mise en place du front-end (Angular)
- [x] Gestion des postes : plan de salle + CRUD
- [x] Gestion des clients : liste, recherche + CRUD (mot de passe provisoire haché avec bcrypt)
- [ ] Authentification et gestion des rôles
- [ ] Réservations
- [ ] Check-in, clôture de session et paiement
- [ ] Catalogue produits et commandes
- [ ] Abonnements
- [ ] Suivi des recettes

## Auteur

Abiel-Jason Anson
