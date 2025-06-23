import express from 'express';
import { listarAcessos, loginAdmin } from '../controllers/adminController.js';
import { autenticar} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin); 
router.get('/acessos', autenticar, listarAcessos); 

export default router;
