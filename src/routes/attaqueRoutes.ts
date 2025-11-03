import { Router } from 'express';
import { creerAttaque, obtenirAttaques, obtenirAttaque } from '../controllers/attaqueController';

const router = Router();

router.post('/', creerAttaque);
router.get('/', obtenirAttaques);
router.get('/:id', obtenirAttaque);

export default router;
