# Rastreador de Gastos

App de controle financeiro pessoal. Você registra o que entra e o que sai e vê no dashboard para onde seu dinheiro está indo.

## Descrição

O objetivo do projeto é facilitar o controle dos gastos cotidianos. Cada transação pode ser cadastrada com descrição, valor, data, categoria e tipo (entrada ou saída), permitindo o acompanhamento de gráficos de gastos por categoria, com filtros por semana, mês ou ano.

Estão em desenvolvimento as seguintes funcionalidades adicionais:

-sugestão automática de categoria a partir da descrição;
-aprender com as correções que o usuário faz;
-limite de gastos com alerta quando for ultrapassado.

## Requisitos funcionais

**RF01:** cadastrar uma transação com descrição, valor, data, categoria e tipo (entrada ou saída).
**RF02:** não permitir o cadastro com descrição ou data vazia, nem com valor menor ou igual a zero, mostrando uma mensagem de erro.
**RF03:** oferecer categorias prontas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário e Outros.
**RF04:** mostrar no dashboard um gráfico com o total de saídas por categoria.
**RF05:** filtrar o dashboard por semana, mês ou ano.
**RF06:** sugerir a categoria com base na descrição digitada (em desenvolvimento).
**RF07:** guardar as correções de categoria e usar nas próximas sugestões (em desenvolvimento).
**RF08:** definir um limite de gastos e avisar visualmente quando passar dele (em desenvolvimento).

## Requisitos não funcionais

**RNF01 (usabilidade):** o lançamento de uma transação deve ser feito em uma tela só, em português e com valores em reais.
**RNF02 (desempenho):** o dashboard deve atualizar logo após cadastrar uma transação ou trocar o filtro.
**RNF03 (compatibilidade):** funcionar nos navegadores mais usados (Chrome, Firefox, Edge e Safari).
**RNF04 (manutenção):** código dividido em componentes React, com as regras de cálculo separadas em funções próprias.
**RNF05 (qualidade):** ter testes automatizados que rodam no Jenkins a cada alteração.
**RNF06 (segurança):** cada usuário só acessa os próprios dados, e as chaves de acesso não ficam no repositório.

## Tecnologias

-React
-Chart.js (gráficos)
-Supabase (banco de dados, ainda não integrado)
-Jest (testes)
-Jenkins (CI/CD)
-Jira (organização com Scrum)

## Como rodar

cd rastreador-financeiro
npm install
npm start

O app abre em http://localhost:3000. Para rodar os testes: npm test.

## Organização do projeto

Usamos Scrum no Jira. Link do quadro: https://cabralrenata18.atlassian.net/jira/software/projects/RF/boards/3/backlog?selectedIssue=RF-6

Integrantes: Debora de Farias Negri e Renata Bernardes Cabral