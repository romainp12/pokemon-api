import { Router } from 'express';
import { 
    creerDresseur, 
    obtenirDresseurs, 
    obtenirDresseur, 
    ajouterPokemonAuDresseur, 
    soignerTousPokemons,
    defiAleatoire,
    arene1,
    defiDeterministe,
    arene2
} from '../controllers/dresseurController';

const router = Router();

router.post('/', creerDresseur);
router.get('/', obtenirDresseurs);
router.get('/:id', obtenirDresseur);
router.post('/:id/pokemons', ajouterPokemonAuDresseur);
router.post('/:id/soigner', soignerTousPokemons);
router.post('/:id/defi-aleatoire', defiAleatoire);
router.post('/:id/arene1', arene1);
router.post('/:id/defi-deterministe', defiDeterministe);
router.post('/:id/arene2', arene2);

export default router;
