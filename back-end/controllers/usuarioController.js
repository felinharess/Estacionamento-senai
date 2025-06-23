import { Usuario } from '../models/Usuario.js';
import jwt from 'jsonwebtoken'

export const criarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
};
export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    // console.log('Usuário encontrado:', usuario?.dataValues); 

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario },
      process.env.SEGREDO_JWT, 
      { expiresIn: '1h' }
    );

    res.json({
      token,
      nome: usuario.nome,
      email: usuario.email
    });

  } catch (error) {
    console.error('Erro no login:', error); 
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }

};