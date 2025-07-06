
import { describe, it, expect, beforeEach } from 'vitest';

let veiculos = [];
let acessos = [];

function cadastrarVeiculo(placa, modelo) {
  const novo = { id: veiculos.length + 1, placa, modelo };
  veiculos.push(novo);
  return novo;
}

function registrarEntrada(idVeiculo) {
  const entrada = { id: acessos.length + 1, veiculoId: idVeiculo, entrada: Date.now() };
  acessos.push(entrada);
  return entrada;
}

function registrarSaida(idAcesso) {
  const acesso = acessos.find(a => a.id === idAcesso);
  acesso.saida = Date.now();
  return acesso;
}

function removerVeiculo(idVeiculo) {
  veiculos = veiculos.filter(v => v.id !== idVeiculo);
  return true;
}

describe('E2E - Fluxo Completo', () => {
  beforeEach(() => {
    veiculos = [];
    acessos = [];
  });

  it('deve executar todo o fluxo com sucesso', () => {
    const v = cadastrarVeiculo("MNO-2025", "Uno");
    const entrada = registrarEntrada(v.id);
    const saida = registrarSaida(entrada.id);
    const remocao = removerVeiculo(v.id);

    expect(veiculos.find(v => v.id === v.id)).toBeUndefined();
    expect(entrada).toHaveProperty("entrada");
    expect(saida).toHaveProperty("saida");
    expect(remocao).toBe(true);
  });
});
