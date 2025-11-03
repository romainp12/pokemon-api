import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Pokemon } from '../models/Pokemon';
import { Attaque } from '../models/Attaque';

export const creerPokemon = async (req: Request, res: Response) => {
    try {
        const { nom, lifePoint } = req.body;
        
        const result = await pool.query(
            'INSERT INTO pokemons (nom, life_point, max_life_point) VALUES ($1, $2, $3) RETURNING *',
            [nom, lifePoint, lifePoint]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du Pokémon' });
    }
};

export const obtenirPokemons = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM pokemons');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des Pokémon' });
    }
};

export const obtenirPokemon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pokemons WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }

        const attaquesResult = await pool.query(
            `SELECT a.* FROM attaques a 
             JOIN pokemon_attaques pa ON a.id = pa.attaque_id 
             WHERE pa.pokemon_id = $1`,
            [id]
        );

        res.json({
            ...result.rows[0],
            attaques: attaquesResult.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du Pokémon' });
    }
};

export const ajouterAttaque = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { attaqueId } = req.body;

        const countResult = await pool.query(
            'SELECT COUNT(*) FROM pokemon_attaques WHERE pokemon_id = $1',
            [id]
        );

        if (parseInt(countResult.rows[0].count) >= 4) {
            return res.status(400).json({ error: 'Le Pokémon a déjà 4 attaques' });
        }

        const existingAttaque = await pool.query(
            'SELECT * FROM pokemon_attaques WHERE pokemon_id = $1 AND attaque_id = $2',
            [id, attaqueId]
        );

        if (existingAttaque.rows.length > 0) {
            return res.status(400).json({ error: 'Le Pokémon connaît déjà cette attaque' });
        }

        await pool.query(
            'INSERT INTO pokemon_attaques (pokemon_id, attaque_id) VALUES ($1, $2)',
            [id, attaqueId]
        );

        res.json({ message: 'Attaque ajoutée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'attaque' });
    }
};

export const soignerPokemon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await pool.query(
            'UPDATE pokemons SET life_point = max_life_point WHERE id = $1',
            [id]
        );

        res.json({ message: 'Pokémon soigné avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du soin du Pokémon' });
    }
};
