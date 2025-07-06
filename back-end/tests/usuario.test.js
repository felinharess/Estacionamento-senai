
import { describe, it, expect, beforeEach } from 'vitest';

const usuarios = [];

function cadastrarUsuario(email) {
  const existe = usuarios.find(u => u.email === email);
  if (existe) throw new Error("Email duplicado");
  usuarios.push({ email });
  return { sucesso: true };
}

describe('Cadastro de Usuário', () => {
  beforeEach(() => {
    usuarios.length = 0; // limpa usuários
    usuarios.push({ email: "teste@email.com" });
  });

  it('deve lançar erro ao tentar cadastrar e-mail já existente', () => {
    expect(() => cadastrarUsuario("teste@email.com")).toThrow("Email duplicado");
  });

  it('deve cadastrar novo usuário com e-mail diferente', () => {
    const resultado = cadastrarUsuario("novo@email.com");
    expect(resultado.sucesso).toBe(true);
  });
});
