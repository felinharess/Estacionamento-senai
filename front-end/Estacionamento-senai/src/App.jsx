import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroVeiculo from './pages/CadastroVeiculo';
import RegistroAcesso from './pages/RegistroAcesso';
import DashboardAdmin from './pages/DashboardAdmin';
import LoginAdmin from './pages/LoginAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/cadastro-veiculo" element={<CadastroVeiculo />} />
        <Route path="/registro-acesso" element={<RegistroAcesso />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin" element={<LoginAdmin />} />

      </Routes>
    </Router>
  );
}

export default App;
