import express from 'express';
import {
  listarAcessos,
  listarUsuarios,
  listarVeiculos,
  loginAdmin,
  editarUsuario,
  excluirUsuario,
  editarVeiculo,
  excluirVeiculo
} from '../controllers/adminController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);

router.get('/acessos', autenticar, listarAcessos);

router.get('/usuarios', autenticar, listarUsuarios);
router.put('/usuarios/:id', autenticar, editarUsuario);      
router.delete('/usuarios/:id', autenticar, excluirUsuario); 

router.get('/veiculos', autenticar, listarVeiculos);
router.put('/veiculos/:id', autenticar, editarVeiculo);     
router.delete('/veiculos/:id', autenticar, excluirVeiculo);  

export default router;
