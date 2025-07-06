
describe('Sistema de Estacionamento - Cypress E2E', () => {
  it('Deve carregar a página inicial com sucesso', () => {
    cy.visit('http://localhost:5173'); // Porta padrão do Vite
    cy.contains('Estacionamento').should('exist');
  });

  it('Deve exibir formulário de cadastro de veículo', () => {
    cy.visit('http://localhost:5173');
    cy.get('form').should('exist');
    cy.get('input[placeholder="Placa"]').type('XYZ-9876');
    cy.get('input[placeholder="Modelo"]').type('Corsa');
    cy.contains('Cadastrar').click();
    cy.contains('XYZ-9876').should('exist');
  });

  it('Deve simular fluxo de entrada e saída de veículo', () => {
    // Simulação com base em componentes esperados
    cy.visit('http://localhost:5173');
    cy.contains('Entrada').click();
    cy.contains('Saída').click();
    cy.contains('Remover').click();
  });
});
