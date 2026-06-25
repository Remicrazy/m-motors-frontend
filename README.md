# M-Motors — Frontend

Interface web développée avec **React 18 + TypeScript + Vite** pour la plateforme M-Motors de vente et location longue durée de véhicules d'occasion.

## 🔗 Liens du projet

| Description | Lien / Valeur |
|---|---|
| **Application déployée** | https://m-motors-frontend-nu.vercel.app |
| **Repository Git (frontend)** | https://github.com/Remicrazy/m-motors-frontend |
| **Repository Git (backend)** | https://github.com/Remicrazy/m-motors-backend |
| **API backend** | https://m-motors-backend-production.up.railway.app |
| **Swagger UI** | https://m-motors-backend-production.up.railway.app/api/docs |
| **Login ADMIN** | admin@mmotors.fr / Admin123! |
| **Login CLIENT** | client@test.fr / Client123! |

## Stack technique

| Technologie | Usage |
|---|---|
| React 18 + TypeScript | Framework UI |
| Vite | Bundler + dev server |
| Tailwind CSS 3 | Styles utilitaires |
| React Router v6 | Navigation SPA |
| TanStack Query v5 | Gestion données serveur + cache |
| React Hook Form + Zod | Formulaires + validation |
| Axios | Appels API HTTP avec intercepteur JWT |
| Lucide React | Icônes |
| Vercel | Hébergement frontend (CDN mondial) |

## Pages et fonctionnalités

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Page d'accueil + présentation LLD |
| `/vehicules` | Public | Catalogue avec filtres (type, marque, prix, km) |
| `/vehicules/:id` | Public | Fiche détaillée + options LLD + dépôt dossier |
| `/login` | Public | Connexion JWT |
| `/inscription` | Public | Création de compte client |
| `/mon-espace` | CLIENT | Tableau de bord — liste des dossiers + statuts |
| `/mon-espace/dossier/:id` | CLIENT | Détail dossier + upload pièces justificatives |
| `/admin` | ADMIN | Tableau de bord — KPIs (véhicules, dossiers) |
| `/admin/vehicules` | ADMIN | Gestion catalogue (ajout, bascule type) |
| `/admin/dossiers` | ADMIN | Validation / refus des dossiers clients |

## Parcours fonctionnels testés en production

**Parcours client :**
1. Inscription → connexion
2. Catalogue → filtres → fiche véhicule
3. Dépôt dossier achat ou LLD (avec durée)
4. Upload pièces justificatives (PDF/JPG/PNG, 5 Mo max)
5. Suivi statut (EN_ATTENTE → VALIDE / REFUSE)
6. Affichage motif de refus si applicable

**Parcours admin :**
1. Connexion compte ADMIN
2. Dashboard KPIs
3. Gestion des dossiers (filtrage par statut)
4. Validation ou refus avec motif obligatoire
5. Gestion des véhicules (ajout, bascule achat ↔ location)

## Lancer en local

### Prérequis
- Node.js 18+, backend M-Motors démarré sur le port 8080

```bash
npm install
cp .env.example .env  # puis éditer VITE_API_URL
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Build production

```bash
npm run build
```

## Variables d'environnement Vercel

| Variable | Valeur |
|---|---|
| `VITE_API_URL` | `https://m-motors-backend-production.up.railway.app/api` |
