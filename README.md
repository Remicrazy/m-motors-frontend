# M-Motors — Frontend

Interface web développée avec **React 18 + TypeScript + Vite** pour la plateforme M-Motors.

## Stack technique

| Technologie | Usage |
|---|---|
| React 18 + TypeScript | Framework UI |
| Vite | Bundler + dev server |
| Tailwind CSS 3 | Styles utilitaires |
| React Router v6 | Navigation SPA |
| TanStack Query (React Query) | Gestion des données serveur |
| React Hook Form + Zod | Formulaires + validation |
| Axios | Appels API HTTP |
| Lucide React | Icônes |
| Vercel | Hébergement frontend |

## Pages

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Page d'accueil |
| `/vehicules` | Public | Catalogue avec filtres (US-01, US-02) |
| `/vehicules/:id` | Public | Fiche détaillée + dépôt dossier (US-03, US-07) |
| `/login` | Public | Connexion (US-05) |
| `/inscription` | Public | Création de compte (US-04) |
| `/mon-espace` | Client | Tableau de bord + liste dossiers (US-09) |
| `/mon-espace/dossier/:id` | Client | Détail + upload documents (US-08) |
| `/admin` | Admin | Tableau de bord admin |
| `/admin/vehicules` | Admin | Gestion catalogue (US-11, US-12, US-13) |
| `/admin/dossiers` | Admin | Validation dossiers (US-14, US-15) |

## Lancer en local

### Prérequis
- Node.js 18+
- Backend M-Motors démarré sur le port 8080

### Installation

```bash
npm install
```

### Configuration

Copier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Contenu de `.env` :

```env
VITE_API_URL=http://localhost:8080/api
```

### Démarrer

```bash
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
