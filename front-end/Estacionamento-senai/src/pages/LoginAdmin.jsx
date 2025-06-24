import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiMail, FiLogIn } from 'react-icons/fi';
import './LoginAdmin.css';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('https://estacionamento-senai-3eik.onrender.com/admin/login', {
        email,
        senha
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tipo', 'admin');

      alert('Login de administrador realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao fazer login: ' + (error.response?.data?.error || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <FiLock size={28} className="admin-icon" />
          <h2 className="admin-login-title">Acesso Administrativo</h2>
          <p className="admin-login-subtitle">Sistema de gerenciamento</p>
        </div>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email administrativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-login-input"
              required
            />
          </div>

          <div className="admin-input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="admin-login-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`admin-login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              'Autenticando...'
            ) : (
              <>
                <FiLogIn className="button-icon" />
                Acessar Painel
              </>
            )}
          </button>

          <div className="admin-login-footer">
            <Link to="/" className="back-link">
              ← Voltar para login comum
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}