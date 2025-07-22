# Desafio Técnico - Testes de Software 

Este desafio consiste em testes automatizados end-to-end desenvolvidos com [Cypress](https://www.cypress.io/)

##  Descrição

Os testes têm como objetivo verificar diferentes fluxos de busca por notebook no site da loja Magazine Luiza. 
Nesse sentido foram considerados os seguintes cenários:

- Busca por palavra-chave correta
- Busca com campo vazio
- Busca com apenas um espaço no campo
- Busca com erro de digitação
- Busca com aplicação de filtros por marca
- Verificação de número de resultados ao aplicar filtros e ordenações

## Como executar os testes

### 1. Clone o repositório
```bash
git clone https://github.com/bvasconcelos710/desafio-tecnico-klok.git
```

### 2. Instale as dependências
Certifique-se de ter o node.js instalado
```bash
npm install
```

### 3. Execute o Cypress
```bash
npx cypress open
```

### 4. Execute o arquivo de testes
Ao abrir a interface do Cypress:
- Selecione o tipo de teste e2e;
- Em seguida selecione o navegador;
- Por fim selecione arquivo busca-magalu.cy.js.
