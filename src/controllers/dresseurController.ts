import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Dresseur } from '../models/Dresseur';
import { Pokemon } from '../models/Pokemon';
import { Attaque } from '../models/Attaque';

const chargerDresseur = async (dresseurId: number): Promise<Dresseur | null> => {
    const dresseurResult = await pool.query('SELECT * FROM dresseurs WHERE id = $1', [dresseurId]);
    
    if (dresseurResult.rows.length === 0) {
        return null;
    }

    const dresseurData = dresseurResult.rows[0];
    const dresseur = new Dresseur(dresseurData.nom);
    dresseur['level'] = dresseurData.level;
    dresseur['experience'] = dresseurData.experience;

    const pokemonsResult = await pool.query(
        `SELECT p.* FROM pokemons p 
         JOIN dresseur_pokemons dp ON p.id = dp.pokemon_id 
         WHERE dp.dresseur_id = $1`,
        [dresseurId]
    );

    for (const pokemonData of pokemonsResult.rows) {
        const pokemon = new Pokemon(pokemonData.nom, pokemonData.life_point);
        pokemon['maxLifePoint'] = pokemonData.max_life_point;

        const attaquesResult = await pool.query(
            `SELECT a.* FROM attaques a 
             JOIN pokemon_attaques pa ON a.id = pa.attaque_id 
             WHERE pa.pokemon_id = $1`,
            [pokemonData.id]
        );

        for (const attaqueData of attaquesResult.rows) {
            const attaque = new Attaque(attaqueData.nom, attaqueData.damage, attaqueData.usage_limit);
            pokemon.apprendreAttaque(attaque);
        }

        dresseur.ajouterPokemon(pokemon);
    }

    return dresseur;
};

export const creerDresseur = async (req: Request, res: Response) => {
    try {
        const { nom } = req.body;
        
        const result = await pool.query(
            'INSERT INTO dresseurs (nom) VALUES ($1) RETURNING *',
            [nom]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du dresseur' });
    }
};

export const obtenirDresseurs = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM dresseurs');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des dresseurs' });
    }
};

export const obtenirDresseur = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM dresseurs WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Dresseur non trouvé' });
        }

        const pokemonsResult = await pool.query(
            `SELECT p.* FROM pokemons p 
             JOIN dresseur_pokemons dp ON p.id = dp.pokemon_id 
             WHERE dp.dresseur_id = $1`,
            [id]
        );

        res.json({
            ...result.rows[0],
            pokemons: pokemonsResult.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du dresseur' });
    }
};

export const ajouterPokemonAuDresseur = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { pokemonId } = req.body;

        await pool.query(
            'INSERT INTO dresseur_pokemons (dresseur_id, pokemon_id) VALUES ($1, $2)',
            [id, pokemonId]
        );

        res.json({ message: 'Pokémon ajouté au dresseur avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du Pokémon au dresseur' });
    }
};

export const soignerTousPokemons = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await pool.query(
            `UPDATE pokemons 
             SET life_point = max_life_point 
             WHERE id IN (
                 SELECT pokemon_id FROM dresseur_pokemons WHERE dresseur_id = $1
             )`,
            [id]
        );

        res.json({ message: 'Tous les Pokémon ont été soignés' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du soin des Pokémon' });
    }
};

export const defiAleatoire = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adversaireId } = req.body;

        const dresseur1 = await chargerDresseur(parseInt(id));
        const dresseur2 = await chargerDresseur(adversaireId);

        if (!dresseur1 || !dresseur2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'existe pas' });
        }

        const resultat = dresseur1.defiAleatoire(dresseur2);

        await pool.query(
            'UPDATE dresseurs SET level = $1, experience = $2 WHERE id = $3',
            [dresseur1.getLevel(), dresseur1.getExperience(), id]
        );

        await pool.query(
            'UPDATE dresseurs SET level = $1, experience = $2 WHERE id = $3',
            [dresseur2.getLevel(), dresseur2.getExperience(), adversaireId]
        );

        res.json({ resultat });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du défi aléatoire' });
    }
};

export const arene1 = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adversaireId } = req.body;

        const dresseur1 = await chargerDresseur(parseInt(id));
        const dresseur2 = await chargerDresseur(adversaireId);

        if (!dresseur1 || !dresseur2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'existe pas' });
        }

        const resultat = dresseur1.arene1(dresseur2);

        await pool.query(
            'UPDATE dresseurs SET level = $1, experience = $2 WHERE id = $3',
            [dresseur1.getLevel(), dresseur1.getExperience(), id]
        );

        await pool.query(
            'UPDATE dresseurs SET level = $1, experience = $2 WHERE id = $3',
            [dresseur2.getLevel(), dresseur2.getExperience(), adversaireId]
        );

        res.json({ resultat });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'arène 1' });
    }
};

export const defiDeterministe = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adversaireId } = req.body;

        const dresseur1 = await chargerDresseur(parseInt(id));
        const dresseur2 = await chargerDresseur(adversaireId);

        if (!dresseur1 || !dresseur2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'existe pas' });
        }

        const resultat = dresseur1.defiDeterministe(dresseur2);

        await pool.query(
            'UPDATE dresseurs SET level = $1, experience = $2 WHERE id = $3',
            [dresseur1.getLevel(), dresseur1.getExperience(), id]
        );

        await pool.query(
            'UPDATE dresseurs SET level = $1, experience = $2 WHERE id = $3',
            [dresseur2.getLevel(), dresseur2.getExperience(), adversaireId]
        );

        res.json({ resultat });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du défi déterministe' });
    }
};

export const arene2 = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adversaireId } = req.body;

        const dresseur1 = await chargerDresseur(parseInt(id));
        const dresseur2 = await chargerDresseur(adversaireId);

        if (!dresseur1 || !dresseur2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'existe pas' });
        }

        const resultat = dresseur1.arene2(dresseur2);

        res.json({ resultat });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'arène 2' });
    }
};
