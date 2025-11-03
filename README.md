# API Pokémon

API REST avec Express TS et PostgreSQL.

## Installation

```bash
npm install
```

## Configuration

Créer une BD PostgreSQL et modifier le fichier `.env` :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pokemon
DB_USER=votre_user
DB_PASSWORD=
```

## Lancement

```bash
npm run dev
```

Les tables sont créées automatiquement au démarrage.

## Données de test

Pour insérer des données de test :

```bash
psql -d pokemon -f test.sql
```

## Structure

- **Models** : `Attaque`, `Pokemon`, `Dresseur` (classes POO)
- **Controllers** : Logique métier
- **Routes** : Endpoints de l'API
- **Database** : Configuration PostgreSQL

## Endpoints

### Pokémon
- `POST /api/pokemons` - Créer un Pokémon
- `GET /api/pokemons` - Liste des Pokémon
- `POST /api/pokemons/:id/attaques` - Ajouter une attaque
- `POST /api/pokemons/:id/soigner` - Soigner un Pokémon

### Dresseurs
- `POST /api/dresseurs` - Créer un dresseur
- `GET /api/dresseurs/:id` - Voir un dresseur
- `POST /api/dresseurs/:id/pokemons` - Ajouter un Pokémon
- `POST /api/dresseurs/:id/defi-aleatoire` - Combat aléatoire
- `POST /api/dresseurs/:id/arene1` - Arène 1 (100 combats)
- `POST /api/dresseurs/:id/defi-deterministe` - Combat déterministe
- `POST /api/dresseurs/:id/arene2` - Arène 2 (100 combats)

### Attaques
- `POST /api/attaques` - Créer une attaque
- `GET /api/attaques` - Liste des attaques

## Fonctionnalités

- Gestion des Pokémon avec max 4 attaques (pas de doublon)
- Système de combat avec attaques aléatoires
- Points de vie et limites d'usage des attaques
- Système d'XP et de level pour les dresseurs
- 4 modes de combat différents
