import express from 'express';
import { listarAcessos, listarUsuarios, listarVeiculos, loginAdmin } from '../controllers/adminController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin); 
router.get('/acessos', autenticar, listarAcessos); 
router.get('/usuarios', autenticar, listarUsuarios);  // ✅ nova rota
router.get('/veiculos', autenticar, listarVeiculos);  // ✅ nova rota

export default router;
