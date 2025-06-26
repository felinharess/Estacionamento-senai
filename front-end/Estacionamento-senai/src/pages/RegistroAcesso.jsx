import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiTruck, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './RegistroAcesso.css';

const TOTAL_VAGAS = 100; // total de vagas do estacionamento

export default function RegistroAcesso() {
  const [placa, setPlaca] = useState('');
  const [acao, setAcao] = useState('entrada');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vagasDisponiveis, setVagasDisponiveis] = useState(TOTAL_VAGAS);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Função para buscar vagas disponíveis no backend (quantidade de acessos ativos)
  const atualizarVagasDisponiveis = async () => {
    try {
      const res = await axios.get(
        'https://estacionamento-senai-3eik.onrender.com/acessos/ativos/count',);
      const acessosAtivos = res.data.count ?? 0;
      setVagasDisponiveis(TOTAL_VAGAS - acessosAtivos);
    } catch (error) {
      console.error('Erro ao atualizar vagas disponíveis:', error);
    }
  };

  useEffect(() => {
    atualizarVagasDisponiveis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!placa) {
      alert('Informe a placa do veículo.');
      return;
    }

    if (!token) {
      alert('Usuário não autenticado. Faça login.');
      return;
    }

    try {
      setLoading(true);

      // Buscar o veículo pela placa
      const veiculoResponse = await axios.get(
        `https://estacionamento-senai-3eik.onrender.com/veiculos/placa/${placa}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const veiculo = veiculoResponse.data;

      if (!veiculo || !veiculo.id_veiculo) {
        alert('Veículo não encontrado.');
        setLoading(false);
        return;
      }

      const agora = new Date();
      const dataAtual = agora.toISOString().split('T')[0];
      const horaAtual = agora.toTimeString().split(' ')[0];

      if (acao === 'entrada') {
        if (vagasDisponiveis <= 0) {
          alert('Não há vagas disponíveis no momento.');
          setLoading(false);
          return;
        }
        // Registrar entrada
        await axios.post(
          'https://estacionamento-senai-3eik.onrender.com/acessos/entrada',
          {
            id_veiculo: veiculo.id_veiculo,
            data_entrada: dataAtual,
            hora_entrada: horaAtual,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVagasDisponiveis((v) => v - 1); // decrementa vagas
      } else {
        // Buscar acesso ativo
        const acessoResponse = await axios.get(
          `https://estacionamento-senai-3eik.onrender.com/acessos/ativos/${veiculo.id_veiculo}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const acessoAtivo = acessoResponse.data;

        if (!acessoAtivo || !acessoAtivo.id_acesso) {
          alert('Nenhum acesso ativo encontrado para este veículo.');
          setLoading(false);
          return;
        }

        // Registrar saída
        await axios.put(
          `https://estacionamento-senai-3eik.onrender.com/acessos/saida/${acessoAtivo.id_acesso}`,
          {
            data_saida: dataAtual,
            hora_saida: horaAtual,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVagasDisponiveis((v) => v + 1); // incrementa vagas
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

        <div className="vagas-disponiveis">
          <strong>Vagas Disponíveis:</strong> {vagasDisponiveis}
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
