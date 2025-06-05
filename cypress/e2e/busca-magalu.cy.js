/// <reference types="Cypress" />

describe('Teste de busca - Magazine Luiza', () => {
  const url = 'https://www.magazineluiza.com.br/';

  // Função para extrair o número de resultados da busca
  function extrairResultado(text) {
    const regexNumero = /^\d+/;
    const match = text.match(regexNumero);
    return match ? Number(match[0]) : null;
  }

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });

    cy.visit(url);
  });

  it('Busca por "notebook"', () => {
    cy.get('input[data-testid=input-search]')
      .type('notebook{enter}');

    cy.get('[data-testid="product-list"]', { timeout: 10000 })
      .should('exist');

    cy.get('[data-testid="product-list"] li', { timeout: 10000 })
      .should('have.length.greaterThan', 0);
  });

  it('Busca com campo vazio, deve permanecer na mesma página', () => {
    cy.get('input[data-testid=input-search]')
      .type('{enter}');

    cy.url().should('eq', url);
  });

  it('Busca com espaço, deve permanecer na mesma página', () => {
    cy.get('input[data-testid=input-search]')
      .type(' {enter}');

    cy.url().should('eq', url);
  });

  it('Busca por produto com erro de digitação', () => {
    cy.get('input[data-testid=input-search]')
      .type('notbuk{enter}');

    cy.contains('Resultados para notebook', { timeout: 10000 })

    cy.contains('Em vez disso, pesquisar por')

    cy.get('[data-testid="product-list"] li')
      .should('have.length.greaterThan', 0);
  });

  it('Pesquisa notebook, aplica filtro de marca apple e verifica se ao menos um resultado da marca é exbido', () => {

    cy.get('input[data-testid=input-search]').type('notebook{enter}');

    cy.get('[data-testid="filter-checkbox"]', { timeout: 10000 }).contains('apple', { matchCase: false }).click();

    cy.get('[data-brand=apple]', { timeout: 10000 }).should("have.length.at.least", 1);
  });

  // Esse pode falhar pois em alguns dos resultados o data-brand está com o valor diferente de "apple"
  it('Pesquisa notebook, aplica filtro de marca apple e verifica se todos os resultados são da marca apple', () => {

    cy.get('input[data-testid=input-search]').type('notebook{enter}');

    cy.get('[data-testid="filter-checkbox"]', { timeout: 10000 }).contains('apple', { matchCase: false }).click();

    cy.get('[data-testid="product-card-container"]', { timeout: 10000 })
      .each(($el) => {
        cy.wrap($el)
          .invoke('attr', 'data-brand')
          .should('eq', 'apple');
      });

  });

  it('Pesquisa notebook, aplica filtro de marca apple e verifica que nenhum resultado da marca acer é exibido', () => {

    cy.get('input[data-testid=input-search]').type('notebook{enter}');

    cy.get('[data-testid="filter-checkbox"]', { timeout: 10000 }).contains('apple', { matchCase: false }).click();

    cy.get('[data-brand=acer]', { timeout: 10000 }).should('not.exist');
  });

  it('Pesquisar notebook, aplica filtro da marca Acer e verifica a url', () => {

    cy.get('input[data-testid=input-search]').type('notebook{enter}');

    cy.get('[data-testid="filter-checkbox"]', { timeout: 10000 }).contains('acer', { matchCase: false }).click();

    cy.url({ timeout: 10000 }).should('include', 'acer');

    cy.get('[data-testid="product-card-container"]').should('exist');
  });

  it("Aplicar filtros adicionais deve manter o número de resultados ou diminuir", () => {
    cy.get('input[data-testid=input-search]').type("notebook{enter}");

    cy.get('[data-testid="filter-checkbox"]', { timeout: 10000 }).contains("Apple", { matchCase: false }).click();

    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");

    cy.get('div[data-testid="mod-f"] p')
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        const num = extrairResultado(text);
        expect(num).to.be.a("number");
        cy.wrap(num).as("numerosBusca");
      });

    cy.contains('[data-testid="main-title"]', "Vendido por")
      .parent()
      .parent()
      .parent()
      .siblings('[data-testid="item-content"]')
      .first()
      .children("ul")
      .children("li")
      .first()
      .click();

    cy.get('[data-testid="loading"]').should("not.exist");

    cy.get('div[data-testid="mod-f"] p')
      .should("be.visible")
      .invoke("text")
      .then(extrairResultado)
      .then((numerosBuscaFiltrado) => {
        cy.get("@numerosBusca").then((numerosBusca) => {
          expect(numerosBuscaFiltrado).to.be.lte(numerosBusca);
        });
      });
  });

  // Esse pode falhar pois às vezes alterar a ordenação muda o numero de resultados, o que não é um comportamente comum
  it("Alterar ordenação não deve alterar o número de resultados", () => {
    cy.get('input[data-testid=input-search]').type("notebook{enter}");

    cy.get('[data-testid="filter-checkbox"]', { timeout: 10000 }).contains("Apple").click();

    cy.get('[data-testid="loading"]').should("not.exist");

    cy.get('div[data-testid="mod-f"] p')
      .should("be.visible")
      .invoke("text")
      .then((text) => cy.wrap(extrairResultado(text)).as("numerosBusca"));

    cy.get('[data-testid="select-desktop-with-label"]').select("Maior Preço");
    cy.get('[data-testid="loading"]').should("not.exist");

    cy.get('div[data-testid="mod-f"] p')
      .should("be.visible")
      .invoke("text")
      .then(extrairResultado)
      .then((numerosBuscaOrdenado) => {
        cy.get("@numerosBusca").then((numerosBusca) => {
          expect(numerosBuscaOrdenado).to.be.equal(numerosBusca);
        });
      });
  });
});
