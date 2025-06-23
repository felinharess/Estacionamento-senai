import express from 'express';
import { registrarEntrada, registrarSaida } from '../controllers/acessoController.js';

const router = express.Router();

router.post('/entrada', registrarEntrada); 
router.put('/saida/:id_acesso', registrarSaida); 

export default router;
