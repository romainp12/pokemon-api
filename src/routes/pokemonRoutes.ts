import { Router } from 'express';
import { creerPokemon, obtenirPokemons, obtenirPokemon, ajouterAttaque, soignerPokemon } from '../controllers/pokemonController';

const router = Router();

router.post('/', creerPokemon);
router.get('/', obtenirPokemons);
router.get('/:id', obtenirPokemon);
router.post('/:id/attaques', ajouterAttaque);
router.post('/:id/soigner', soignerPokemon);

export default router;
