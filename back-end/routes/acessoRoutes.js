import express from 'express';
import { registrarEntrada, registrarSaida, buscarAcessoAtivo, contarAcessosAtivos } from '../controllers/acessoController.js';

const router = express.Router();

router.post('/entrada', registrarEntrada); 
router.put('/saida/:id_acesso', registrarSaida); 
router.get('/ativos/:id_veiculo', buscarAcessoAtivo);
router.get('/ativos/count', contarAcessosAtivos);

export default router;
