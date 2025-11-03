import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

export const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS attaques (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                damage INTEGER NOT NULL,
                usage_limit INTEGER NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS pokemons (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                life_point INTEGER NOT NULL,
                max_life_point INTEGER NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS pokemon_attaques (
                pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
                attaque_id INTEGER REFERENCES attaques(id) ON DELETE CASCADE,
                PRIMARY KEY (pokemon_id, attaque_id)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS dresseurs (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                level INTEGER DEFAULT 1,
                experience INTEGER DEFAULT 0
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS dresseur_pokemons (
                dresseur_id INTEGER REFERENCES dresseurs(id) ON DELETE CASCADE,
                pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
                PRIMARY KEY (dresseur_id, pokemon_id)
            );
        `);

        console.log('Base de données initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
};
