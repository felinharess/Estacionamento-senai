import { Acesso } from '../models/Acesso.js';
import { Veiculo } from '../models/Veiculo.js';
import { Usuario } from '../models/Usuario.js';
import { Admin } from '../models/Admin.js';
import jwt from 'jsonwebtoken';

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
};

export const listarVeiculos = async (req, res) => {
  try {
    const veiculos = await Veiculo.findAll();
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar veículos.' });
  }
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

export const loginAdmin = async (req, res) => {
  const { email, senha } = req.body;

  const admin = await Admin.findOne({ where: { email } });

  if (!admin || admin.senha !== senha) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  // ✅ Usa a variável de ambiente
  const token = jwt.sign(
    { id: admin.id_admin, email: admin.email, tipo: 'admin' },
    process.env.SEGREDO_JWT,
    { expiresIn: '1h' }
  );

  res.json({ token });
};
