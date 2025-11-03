import { Request, Response } from 'express';
import { pool } from '../config/database';

export const creerAttaque = async (req: Request, res: Response) => {
    try {
        const { nom, damage, usageLimit } = req.body;
        
        const result = await pool.query(
            'INSERT INTO attaques (nom, damage, usage_limit) VALUES ($1, $2, $3) RETURNING *',
            [nom, damage, usageLimit]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'attaque' });
    }
};

export const obtenirAttaques = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM attaques');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des attaques' });
    }
};

export const obtenirAttaque = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM attaques WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Attaque non trouvée' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'attaque' });
    }
};
