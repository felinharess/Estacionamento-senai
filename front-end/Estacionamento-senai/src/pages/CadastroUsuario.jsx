import { useState } from 'react';
import axios from 'axios';
import './CadastroUsuario.css'; // Importando o arquivo CSS
import { useNavigate, Link } from 'react-router-dom';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://estacionamento-senai-3eik.onrender.com/usuarios', {
        nome,
        email,
        senha
      });
      alert('Usuário cadastrado com sucesso!');
      navigate('/')
    } catch (error) {
      alert('Erro ao cadastrar: ' + (error.response?.data?.mensagem || 'Erro desconhecido'));
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <h2 className="cadastro-title">Cadastro de Usuário</h2>
        <form onSubmit={handleSubmit} className="cadastro-form">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="cadastro-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cadastro-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="cadastro-input"
          />
          <button type="submit" className="cadastro-button">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}