import { Veiculo } from '../models/Veiculo.js';

export const cadastrarVeiculo = async (req, res) => {
  try {
    const { placa, modelo, cor, ano } = req.body;
    const id_usuario = req.usuarioId; // vem do middleware de autenticação

    const veiculo = await Veiculo.create({
      placa,
      modelo,
      cor,
      ano,
      id_usuario // agora o campo obrigatório vai corretamente
    });

    res.status(201).json(veiculo);
  } catch (error) {
    console.error("Erro no cadastro de veículo:", error);
    res.status(500).json({ "Mensagem": error.message }); // devolve só a mensagem
  }
};

export const listarVeiculosPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const veiculos = await Veiculo.findAll({ where: { id_usuario } });
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ "Mensagem": error});
  }
};
// Buscar veículo por placa
export const buscarVeiculoPorPlaca = async (req, res) => {
  try {
    const { placa } = req.params;
    const veiculo = await Veiculo.findOne({ where: { placa } });

    if (!veiculo) {
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }

    res.status(200).json(veiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar veículo.' });
  }
};
