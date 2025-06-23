import express from 'express';
import { cadastrarVeiculo, listarVeiculosPorUsuario } from '../controllers/veiculoController.js';
import { autenticar} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', autenticar, cadastrarVeiculo); // Cadastrar veículo
router.get('/:id_usuario', autenticar, listarVeiculosPorUsuario); // Protegido

export default router;
