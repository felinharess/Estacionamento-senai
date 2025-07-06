
import { describe, it, expect } from 'vitest';

function validarPlaca(placa) {
  const regex = /^[A-Z]{3}-\d{4}$/;
  return regex.test(placa);
}

describe('Validação de Placa de Veículo', () => {
  it('deve rejeitar placa inválida "ABC-12"', () => {
    expect(validarPlaca("ABC-12")).toBe(false);
  });

  it('deve aceitar placa válida "ABC-1234"', () => {
    expect(validarPlaca("ABC-1234")).toBe(true);
  });
});
