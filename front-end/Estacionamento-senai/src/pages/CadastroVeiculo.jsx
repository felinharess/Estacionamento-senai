import { useState } from 'react';
import axios from 'axios';
import './CadastroVeiculo.css';
import { Navigate, useNavigate } from 'react-router-dom';

export default function CadastroVeiculo() {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [ano, setAno] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado. Faça login.');
      return;
    }

    if (!placa || !modelo || !cor) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('https://estacionamento-senai-3eik.onrender.com/veiculos', {
        placa,
        modelo,
        cor,
        ano: ano ? parseInt(ano) : undefined,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Veículo cadastrado com sucesso!');
      navigate('/registro-acesso');

      setPlaca('');
      setModelo('');
      setCor('');
      setAno('');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro ao cadastrar veículo: ' + (error.response?.data?.mensagem || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="veiculo-container">
      <div className="veiculo-card">
        <h2 className="veiculo-title">Cadastro de Veículo</h2>
        <form onSubmit={handleSubmit} className="veiculo-form">
          <div className="input-group">
            <label htmlFor="placa">Placa*</label>
            <input
              id="placa"
              type="text"
              placeholder="ABC-1234"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              pattern="[A-Za-z]{3}-?[0-9]{4}"
              title="Formato: ABC-1234"
              required
              className="veiculo-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="modelo">Modelo*</label>
            <input
              id="modelo"
              type="text"
              placeholder="Ex: Onix 1.0 Turbo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
              className="veiculo-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="cor">Cor*</label>
            <input
              id="cor"
              type="text"
              placeholder="Ex: Prata"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              required
              className="veiculo-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="ano">Ano</label>
            <input
              id="ano"
              type="number"
              placeholder="Ex: 2020"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              className="veiculo-input"
            />
          </div>

          <button type="submit" className="veiculo-button" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
          </button>
        </form>
      </div>
    </div>
  );
}
