import express from 'express';
import { registrarEntrada, registrarSaida, buscarAcessoAtivo } from '../controllers/acessoController.js';

const router = express.Router();

router.post('/entrada', registrarEntrada); 
router.put('/saida/:id_acesso', registrarSaida); 
router.get('/acessos/ativos/:id_veiculo', buscarAcessoAtivo);

export default router;
