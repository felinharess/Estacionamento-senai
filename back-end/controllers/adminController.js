import { Acesso } from '../models/Acesso.js';
import { Veiculo } from '../models/Veiculo.js';
import { Usuario } from '../models/Usuario.js';
import { Admin } from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Listar todos os usuários
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
};

// Listar todos os veículos
export const listarVeiculos = async (req, res) => {
  try {
    const veiculos = await Veiculo.findAll();
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar veículos.' });
  }
};

// Listar todos os acessos com dados de veículo e usuário
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

// Login do administrador
export const loginAdmin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin || admin.senha !== senha) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: admin.id_admin, email: admin.email, tipo: 'admin' },
      process.env.SEGREDO_JWT,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
};

// Editar usuário
export const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

    usuario.nome = nome ?? usuario.nome;
    usuario.email = email ?? usuario.email;
    usuario.senha = senha ?? usuario.senha;

    await usuario.save();
    res.json({ mensagem: 'Usuário atualizado com sucesso.', usuario });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar usuário.' });
  }
};

// Excluir usuário
export const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

    await usuario.destroy();
    res.json({ mensagem: 'Usuário excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
};

// Editar veículo
export const editarVeiculo = async (req, res) => {
  const { id } = req.params;
  const { placa, modelo, cor } = req.body;

  try {
    const veiculo = await Veiculo.findByPk(id);
    if (!veiculo) return res.status(404).json({ error: 'Veículo não encontrado.' });

    veiculo.placa = placa ?? veiculo.placa;
    veiculo.modelo = modelo ?? veiculo.modelo;
    veiculo.cor = cor ?? veiculo.cor;

    await veiculo.save();
    res.json({ mensagem: 'Veículo atualizado com sucesso.', veiculo });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar veículo.' });
  }
};

// Excluir veículo
export const excluirVeiculo = async (req, res) => {
  const { id } = req.params;

  try {
    const veiculo = await Veiculo.findByPk(id);
    if (!veiculo) return res.status(404).json({ error: 'Veículo não encontrado.' });

    await veiculo.destroy();
    res.json({ mensagem: 'Veículo excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir veículo.' });
  }
};
