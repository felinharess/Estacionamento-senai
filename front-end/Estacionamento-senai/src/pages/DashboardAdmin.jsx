import { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardAdmin.css';
import {
  FiUsers, FiTruck, FiClock, FiActivity, FiRefreshCw,
  FiLogIn, FiLogOut, FiMapPin, FiEdit, FiTrash2
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const TOTAL_VAGAS = 100;

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [acessos, setAcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'https://estacionamento-senai-3eik.onrender.com/admin',
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, vRes, aRes] = await Promise.all([
        api.get('/usuarios'),
        api.get('/veiculos'),
        api.get('/acessos'),
      ]);
      setUsuarios(uRes.data);
      setVeiculos(vRes.data);
      setAcessos(aRes.data);

      const hoje = new Date().toISOString().slice(0,10);
      const umaHora = new Date(Date.now() - 3600000).toISOString();
      const ativos = aRes.data.filter(a => a.status === 'ativo').length;

      setStats({
        totalUsuarios: uRes.data.length,
        totalVeiculos: vRes.data.length,
        acessosHoje: aRes.data.filter(a => a.createdAt.includes(hoje)).length,
        acessosUltimaHora: aRes.data.filter(a => a.createdAt >= umaHora).length,
        acessosAtivos: ativos,
        acessosDesativos: aRes.data.length - ativos,
        vagasDisponiveis: TOTAL_VAGAS - ativos
      });

    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUsuario = async (u, action) => {
    try {
      if (action === 'edit') {
        const nome = prompt('Nome:', u.nome);
        const email = prompt('Email:', u.email);
        if (!nome && !email) return;
        await api.put(`/usuarios/${u.id_usuario}`, { nome, email });
      } else {
        if (!confirm('Excluir usuário?')) return;
        await api.delete(`/usuarios/${u.id_usuario}`);
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao processar usuário');
    }
  };

  const handleVeiculo = async (v, action) => {
    try {
      if (action === 'edit') {
        const placa = prompt('Placa:', v.placa);
        const modelo = prompt('Modelo:', v.modelo);
        const cor = prompt('Cor:', v.cor);
        if (!placa && !modelo && !cor) return;
        await api.put(`/veiculos/${v.id_veiculo}`, { placa, modelo, cor });
      } else {
        if (!confirm('Excluir veículo?')) return;
        await api.delete(`/veiculos/${v.id_veiculo}`);
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao processar veículo');
    }
  };

  const chartData = (() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      const s = d.toISOString().slice(0,10);
      return {
        date: d.toLocaleDateString('pt-BR',{day:'numeric',month:'short'}),
        acessos: acessos.filter(a => a.createdAt.includes(s)).length
      };
    }).reverse();
    return days;
  })();

  return (
    <div className="dashboard-admin">
      <header className="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <button onClick={fetchData} className="refresh-button" disabled={loading}>
          <FiRefreshCw className={loading ? 'spin' : ''} />
          {loading ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </header>

      <div className="stats-grid">
        <StatCard icon={<FiUsers />} title="Total Usuários" value={stats.totalUsuarios} color="#4e73df" />
        <StatCard icon={<FiTruck />} title="Total Veículos" value={stats.totalVeiculos} color="#1cc88a" />
        <StatCard icon={<FiClock />} title="Acessos Hoje" value={stats.acessosHoje} color="#f6c23e" />
        <StatCard icon={<FiActivity />} title="Última Hora" value={stats.acessosUltimaHora} color="#e74a3b" />
        <StatCard icon={<FiLogIn />} title="Estacionados" value={stats.acessosAtivos} color="#2d9cdb" />
        <StatCard icon={<FiLogOut />} title="Saídas" value={stats.acessosDesativos} color="#d02d2d" />
        <StatCard icon={<FiMapPin />} title="Vagas Disponíveis" value={stats.vagasDisponiveis} color="#10b981" />
      </div>

      <div className="chart-container">
        <h2>Acessos nos Últimos 7 Dias</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="acessos" fill="#4e73df" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="tables-grid">
        <DataTable
          title="Usuários"
          data={usuarios}
          columns={[
            { header: 'Nome', accessor: 'nome' },
            { header: 'Email', accessor: 'email' },
            {
              header: 'Ações', accessor: u => (
                <>
                  <button onClick={() => handleUsuario(u, 'edit')}><FiEdit /></button>
                  <button onClick={() => handleUsuario(u, 'delete')}><FiTrash2 /></button>
                </>
              )
            }
          ]}
        />

        <DataTable
          title="Veículos"
          data={veiculos}
          columns={[
            { header: 'Placa', accessor: 'placa' },
            { header: 'Modelo', accessor: 'modelo' },
            { header: 'Cor', accessor: 'cor' },
            {
              header: 'Ações', accessor: v => (
                <>
                  <button onClick={() => handleVeiculo(v, 'edit')}><FiEdit /></button>
                  <button onClick={() => handleVeiculo(v, 'delete')}><FiTrash2 /></button>
                </>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="stat-card" style={{ borderBottom: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p>{value ?? 0}</p>
      </div>
    </div>
  );
}

function DataTable({ title, data, columns }) {
  return (
    <div className="data-table">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>{columns.map((c, i) => <th key={i}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((r, ri) => (
            <tr key={ri}>
              {columns.map((c, ci) => (
                <td key={ci}>{typeof c.accessor === 'function' ? c.accessor(r) : r[c.accessor]}</td>
              ))}
            </tr>
          )) : (
            <tr><td colSpan={columns.length}>Nenhum dado disponível</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
