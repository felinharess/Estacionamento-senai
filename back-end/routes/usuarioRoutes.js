import express from 'express';
import { criarUsuario, loginUsuario} from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/', criarUsuario); 
router.post('/login', loginUsuario);   

export default router;
