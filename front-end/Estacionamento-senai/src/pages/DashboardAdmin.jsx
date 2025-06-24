import { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardAdmin.css';
import { FiUsers, FiTruck, FiClock, FiActivity, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [acessos, setAcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalVeiculos: 0,
    acessosHoje: 0,
    acessosUltimaHora: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const [usuariosRes, veiculosRes, acessosRes] = await Promise.all([
        axios.get('http://localhost:3000/admin/usuarios', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:3000/admin/veiculos', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:3000/admin/acessos', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setUsuarios(usuariosRes.data);
      setVeiculos(veiculosRes.data);
      setAcessos(acessosRes.data);

      // Processar estatísticas com checagem para createdAt
      const hoje = new Date().toISOString().split('T')[0];
      const umaHoraAtras = new Date(Date.now() - 3600000).toISOString();

      setStats({
        totalUsuarios: usuariosRes.data.length,
        totalVeiculos: veiculosRes.data.length,
        acessosHoje: acessosRes.data.filter(a => a.createdAt && a.createdAt.includes(hoje)).length,
        acessosUltimaHora: acessosRes.data.filter(a => a.createdAt && a.createdAt >= umaHoraAtras).length
      });

      setLoading(false);
    } catch (error) {
      alert('Erro ao carregar dados do dashboard');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Preparar dados para o gráfico com checagem para createdAt
  const prepareChartData = () => {
    const hoje = new Date();
    const ultimos7Dias = [...Array(7)].map((_, i) => {
      const date = new Date(hoje);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return ultimos7Dias.map(date => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
      acessos: acessos.filter(a => a.createdAt && a.createdAt.includes(date)).length
    }));
  };

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
        <StatCard 
          icon={<FiUsers size={24} />}
          title="Total Usuários"
          value={stats.totalUsuarios}
          color="#4e73df"
        />
        <StatCard 
          icon={<FiTruck size={24} />}
          title="Total Veículos"
          value={stats.totalVeiculos}
          color="#1cc88a"
        />
        <StatCard 
          icon={<FiClock size={24} />}
          title="Acessos Hoje"
          value={stats.acessosHoje}
          color="#f6c23e"
        />
        <StatCard 
          icon={<FiActivity size={24} />}
          title="Última Hora"
          value={stats.acessosUltimaHora}
          color="#e74a3b"
        />
      </div>

      <div className="chart-container">
        <h2>Acessos nos Últimos 7 Dias</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="acessos" fill="#4e73df" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tables-grid">
        <DataTable 
          title="Últimos Usuários"
          data={usuarios.slice(0, 5)}
          columns={[
            { header: 'Nome', accessor: 'nome' },
            { header: 'Email', accessor: 'email' },
            { header: 'Cadastro', accessor: u => new Date(u.createdAt).toLocaleDateString() }
          ]}
          icon={<FiUsers />}
        />

        <DataTable 
          title="Últimos Veículos"
          data={veiculos.slice(0, 5)}
          columns={[
            { header: 'Placa', accessor: 'placa' },
            { header: 'Modelo', accessor: 'modelo' },
            { header: 'Cor', accessor: 'cor' }
          ]}
          icon={<FiTruck />}
        />

        <DataTable 
          title="Registros de Acesso"
          data={acessos.slice(0, 5)}
          columns={[
            { header: 'Placa', accessor: 'placa' },
            { header: 'Ação', accessor: 'acao' },
            { header: 'Horário', accessor: a => new Date(a.createdAt).toLocaleString() }
          ]}
          fullWidth
          icon={<FiClock />}
        />
      </div>
    </div>
  );
}

// Componente de Card de Estatística
function StatCard({ icon, title, value, color }) {
  return (
    <div className="stat-card" style={{ borderBottom: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

// Componente de Tabela de Dados
function DataTable({ title, data, columns, icon, fullWidth = false }) {
  return (
    <div className={`data-table ${fullWidth ? 'full-width' : ''}`}>
      <div className="table-header">
        <div className="table-icon">{icon}</div>
        <h3>{title}</h3>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  Nenhum dado disponível
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
