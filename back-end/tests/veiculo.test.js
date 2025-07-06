
import { describe, it, expect, beforeEach } from 'vitest';

let veiculos = [];
let acessos = [];

function cadastrarVeiculo(placa, modelo) {
  const novo = { id: veiculos.length + 1, placa, modelo };
  veiculos.push(novo);
  return novo;
}

function listarVeiculos() {
  return veiculos;
}

function removerVeiculo(id) {
  const acessoVinculado = acessos.find(a => a.veiculoId === id);
  if (acessoVinculado) throw new Error("Veículo possui acessos vinculados");
  veiculos = veiculos.filter(v => v.id !== id);
  return true;
}

describe('Integração - Veículos', () => {
  beforeEach(() => {
    veiculos = [];
    acessos = [];
  });

  it('deve cadastrar veículo com sucesso (TI-01)', () => {
    const v = cadastrarVeiculo("DEF-1234", "Gol");
    expect(v).toHaveProperty("id");
    expect(veiculos.length).toBe(1);
  });

  it('deve listar veículos cadastrados (TI-02)', () => {
    cadastrarVeiculo("DEF-1234", "Gol");
    const lista = listarVeiculos();
    expect(lista.length).toBe(1);
    expect(lista[0].placa).toBe("DEF-1234");
  });

  it('deve impedir remoção de veículo com acesso vinculado (TI-03)', () => {
    const v = cadastrarVeiculo("XYZ-0001", "Civic");
    acessos.push({ id: 1, veiculoId: v.id });
    expect(() => removerVeiculo(v.id)).toThrow("Veículo possui acessos vinculados");
  });
});
