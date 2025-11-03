import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import pokemonRoutes from './routes/pokemonRoutes';
import attaqueRoutes from './routes/attaqueRoutes';
import dresseurRoutes from './routes/dresseurRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/pokemons', pokemonRoutes);
app.use('/api/attaques', attaqueRoutes);
app.use('/api/dresseurs', dresseurRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Pokémon de Romain :)' });
});

const demarrer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

demarrer();
