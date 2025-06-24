import express from 'express';
import { cadastrarVeiculo, listarVeiculosPorUsuario, buscarVeiculoPorPlaca } from '../controllers/veiculoController.js';
import { autenticar} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', autenticar, cadastrarVeiculo); 
router.get('/:id_usuario', autenticar, listarVeiculosPorUsuario); 
router.get('/placa/:placa', buscarVeiculoPorPlaca);

export default router;
