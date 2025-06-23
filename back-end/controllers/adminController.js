import { Acesso } from '../models/Acesso.js';
import { Veiculo } from '../models/Veiculo.js';
import { Usuario } from '../models/Usuario.js';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const loginAdmin = async (req, res) => {
  const { email, senha } = req.body;

  const admin = await Admin.findOne({ where: { email } });

  if (!admin || admin.senha !== senha) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign(
    { id: admin.id_admin, email: admin.email, tipo: 'admin' },
    'segredo_jwt',
    { expiresIn: '1h' }
  );

  res.json({ token });
};

export const listarAcessos = async (req, res) => {
  try {
    const acessos = await Acesso.findAll({
      include: {
        model: Veiculo,
        include: Usuario
      }
    });
    res.json(acessos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar acessos.' });
  }
};
