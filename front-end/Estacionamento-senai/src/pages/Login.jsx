import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://estacionamento-senai-3eik.onrender.com/usuarios/login', {
        email,
        senha
      });
      localStorage.setItem('token', response.data.token);
      navigate('/registro-acesso');
    } catch (error) {
      alert('Erro ao fazer login: ' + (error.response?.data?.mensagem || 'Erro desconhecido'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">Entrar</button>
          
          <div className="register-link">
            Não está cadastrado? <Link to="/cadastro-usuario">Clique aqui</Link> para se registrar
          </div>
        </form>
      </div>
    </div>
  );
}