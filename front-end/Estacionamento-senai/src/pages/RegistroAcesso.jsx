import { useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiTruck, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './RegistroAcesso.css';

export default function RegistroAcesso() {
  const [placa, setPlaca] = useState('');
  const [acao, setAcao] = useState('entrada');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!placa) {
      alert('Informe a placa do veículo.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Usuário não autenticado. Faça login.');
        setLoading(false);
        return;
      }

      if (acao === 'entrada') {
        // 1. Buscar o veículo pela placa
        const veiculoResponse = await axios.get(
          `http://localhost:3000/veiculos/placa/${placa}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const veiculo = veiculoResponse.data;

        if (!veiculo || !veiculo.id_veiculo) {
          alert('Veículo não encontrado.');
          setLoading(false);
          return;
        }

        // 2. Montar data e hora
        const agora = new Date();
        const data_entrada = agora.toISOString().split('T')[0]; // yyyy-mm-dd
        const hora_entrada = agora.toTimeString().split(' ')[0]; // hh:mm:ss

        // 3. Registrar entrada
        await axios.post(
          'http://localhost:3000/acessos/entrada',
          {
            id_veiculo: veiculo.id_veiculo,
            data_entrada,
            hora_entrada
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        alert('Funcionalidade de saída ainda não implementada.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setPlaca('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Erro ao registrar acesso: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <FiTruck size={24} className="header-icon" />
          <h2>Registro de Acesso Veicular</h2>
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          <div className={`input-group ${placa ? 'has-value' : ''}`}>
            <label htmlFor="placa">Placa do Veículo</label>
            <input
              id="placa"
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              pattern="[A-Za-z]{3}-?[0-9]{4}"
              title="Formato: ABC-1234"
              required
            />
            <span className="input-border"></span>
          </div>

          <div className="input-group radio-group">
            <label>Tipo de Acesso</label>
            <div className="radio-options">
              <label className={`radio-option ${acao === 'entrada' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="acao"
                  value="entrada"
                  checked={acao === 'entrada'}
                  onChange={() => setAcao('entrada')}
                />
                <FiLogIn className="option-icon" />
                <span>Entrada</span>
              </label>

              <label className={`radio-option ${acao === 'saida' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="acao"
                  value="saida"
                  checked={acao === 'saida'}
                  onChange={() => setAcao('saida')}
                />
                <FiLogOut className="option-icon" />
                <span>Saída</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
            disabled={loading}
          >
            {success ? (
              <>
                <FiCheckCircle className="button-icon" />
                Registrado!
              </>
            ) : loading ? (
              'Processando...'
            ) : (
              'Registrar Acesso'
            )}
          </button>
        </form>

        <div className="extra-actions">
          <p>Não encontrou a placa?</p>
          <button className="novo-veiculo-button" onClick={() => navigate('/cadastro-veiculo')}>
            Cadastrar novo veículo
          </button>
        </div>
      </div>
    </div>
  );
}
