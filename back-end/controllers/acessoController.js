import { Acesso } from '../models/Acesso.js';

export const registrarEntrada = async (req, res) => {
  try {
    const { id_veiculo, data_entrada, hora_entrada } = req.body;

    const acesso = await Acesso.create({
      id_veiculo,
      data_entrada,
      hora_entrada,
      status: 'ativo'
    });

    res.status(201).json(acesso);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar entrada.' });
  }
};

export const registrarSaida = async (req, res) => {
  try {
    const { id_acesso } = req.params;
    const { data_saida, hora_saida } = req.body;

    const acesso = await Acesso.findByPk(id_acesso);
    if (!acesso) {
      return res.status(404).json({ error: 'Acesso não encontrado.' });
    }

    acesso.data_saida = data_saida;
    acesso.hora_saida = hora_saida;
    acesso.status = 'concluido';

    await acesso.save();
    res.json(acesso);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar saída.' });
  }
};
