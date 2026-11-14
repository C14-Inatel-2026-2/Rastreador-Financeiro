# Rastreador de Gastos

App de controle financeiro pessoal. Você registra o que entra e o que sai e vê no dashboard para onde seu dinheiro está indo.

## Descrição

O objetivo do projeto é facilitar o controle dos gastos cotidianos. Cada transação pode ser cadastrada com descrição, valor, data, categoria e tipo (entrada ou saída), permitindo o acompanhamento de gráficos de gastos por categoria, com filtros por semana, mês ou ano.

Estão em desenvolvimento as seguintes funcionalidades adicionais:

- sugestão automática de categoria a partir da descrição;
- aprender com as correções que o usuário faz;
- limite de gastos com alerta quando for ultrapassado.

## Uso de IA
 
O grupo usou IA como apoio no desenvolvimento. Todo código sugerido pela IA foi lido, testado e enviado por Pull Request antes do merge.


| Ferramenta | Modelo | Quem usou |
|---|---|---|
| Claude (claude.ai, chat) | Claude Sonnet 5.5 | Débora |
| _preencher_ | _preencher_ | Renata |

## Dinâmica de uso
 
1. Enviávamos a captura de tela do erro, pedido de ajuda no desenvolvimento, duvidas sobre as funcionalidades e descrevíamos o que queríamos.
2. Pedíamos mudanças pequenas e explicadas, para entender o que cada trecho fazia.
3. A IA entregava só os arquivos alterados, junto com a explicação de cada mudança.
4. Lemos o código, rodamos `npm test` e conferimos a tela com `npm start` antes de fazer commit.
5. As mudanças foram enviadas por Pull Request.

## Exemplo de Prompts

**Debora** 

### 1. Conflito de merge no PR do filtro por período
 
**Prompt** (com captura da tela do GitHub):
> "No meu outro pull request, onde adicionei a funcionalidade de filtrar por periodo esta dando conflito, me ajude a resolver sem alterar as funcionalidades do projeto atualmente. O conflito esta no arquivo utils.js"
 
**Resposta da IA:** explicou que a `main` tinha corrigido uma linha do filtro de ano enquanto a branch reescrevia a função inteira, e indicou usar "Accept current change". A IA reproduziu o merge localmente e conferiu que o resultado era idêntico à versão da branch.
 
**Decisão: aceita.** O PR #19 foi resolvido dessa forma e integrado à `main`.

### 2. Comparar o plano do projeto com o código
 
**Prompt** (com o PDF da entrega inicial anexado):
> "Tem alguma funcionalidade deste plano do projeto que ainda não foi implementada no projeto real? Me informe quais funcionalidades ainda faltam ser implementadas"
 
**Resposta da IA:** lista do que faltava (persistência, edição/exclusão, aprendizado com correções, exportação de relatório, forma de pagamento, orçamento por categoria) e das divergências entre o plano e o projeto (CircleCI × Jenkins, IndexedDB × Supabase).
 
**Decisão: aceita.** Usada para escolher a próxima funcionalidade (edição e exclusão).

### 3. Edição e exclusão de transações
 
**Prompt**
> "Quero que me ajude a implementar a Edição e exclusão de transações. Lembrando que a implementaçao deve ser de forma simples, pois preciso entender como foi feito. Me explique passo a passo"
 
**Resposta da IA:** uma lista de transações que alterava apenas o estado local (`useState`), feita sobre a `main` daquele momento.
 
**Decisão: descartada.** O projeto já tinha passado a usar o Supabase, então editar e excluir precisavam alterar o banco.
 
## Requisitos funcionais

- **RF01:** cadastrar uma transação com descrição, valor, data, categoria e tipo (entrada ou saída).
- **RF02:** não permitir o cadastro com descrição ou data vazia, nem com valor menor ou igual a zero, mostrando uma mensagem de erro.
- **RF03:** oferecer categorias prontas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário e Outros.
- **RF04:** mostrar no dashboard um gráfico com o total de saídas por categoria.
- **RF05:** filtrar o dashboard por semana, mês ou ano.
- **RF06:** sugerir a categoria com base na descrição digitada (em desenvolvimento).
- **RF07:** guardar as correções de categoria e usar nas próximas sugestões (em desenvolvimento).
- **RF08:** definir um limite de gastos e avisar visualmente quando passar dele (em desenvolvimento).

## Requisitos não funcionais

- **RNF01 (usabilidade):** o lançamento de uma transação deve ser feito em uma tela só, em português e com valores em reais.
- **RNF02 (desempenho):** o dashboard deve atualizar logo após cadastrar uma transação ou trocar o filtro.
- **RNF03 (compatibilidade):** funcionar nos navegadores mais usados (Chrome, Firefox, Edge e Safari).
- **RNF04 (manutenção):** código dividido em componentes React, com as regras de cálculo separadas em funções próprias.
- **RNF05 (qualidade):** ter testes automatizados que rodam no Jenkins a cada alteração.
- **RNF06 (segurança):** cada usuário só acessa os próprios dados, e as chaves de acesso não ficam no repositório.

## Tecnologias

- React
- Chart.js (gráficos)
- Supabase (banco de dados)
- Jest (testes)
- Jenkins (CI/CD)
- Jira (organização com Scrum)

## Como rodar

```bash
cd rastreador-financeiro
npm install
npm start
```

O app abre em [http://localhost:3000](http://localhost:3000). Para rodar os testes: `npm test`.

## Refactorings

Esta seção registra as melhorias de código feitas sem alterar o comportamento do app. Cada refactoring é feito em uma branch própria (`refactor/...`), com testes passando antes do commit e conferência manual da tela. Para cada um são indicados o smell encontrado, o refactoring aplicado, o motivo e o link do pull request.

### Regras de cálculo e formatação dentro do Dashboard

- **Smell:** Long Method / Large Component. O `Dashboard.js` misturava a tela com contas (total gasto, lista de anos) e com a formatação de valores em reais.
- **Refactoring aplicado:** Extract Function. As funções `formatarReais`, `calcularTotalGasto` e `listarAnos` foram movidas para o `utils.js`, e o `Dashboard.js` passou a chamá-las.
- **Por quê:** atende o RNF04 (regras de cálculo em funções próprias), deixa o componente mais curto e permite testar as contas sem renderizar a tela. Foram adicionados testes dessas funções em `utils.test.js`.
- **PR:** https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/29

### Código morto no projeto

- **Smell:** Dead Code. O `transactionService.js` ficou sem uso depois que o `Transactionform.js` e o `Dashboard.js` passaram a falar direto com o `supabaseClient`, e nada mais importava o arquivo.
- **Refactoring aplicado:** Remove Dead Code. O arquivo foi excluído, assim como a pasta duplicada do dashboard (`src/Dashboard.js`) em uma limpeza anterior.
- **Por quê:** havia dois caminhos para acessar os dados, o que gerava confusão e chegou a atrapalhar os testes, em que o mock do Supabase não batia com o que o código usava. Como nada importava o arquivo, o comportamento não muda.
- **PR:** https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/28

### Sugestão de categoria dentro do componente

- **Smell:** Conditional Complexity. A `sugerirCategoria` ficava dentro do `Transactionform.js`, com uma cadeia de `if` e vários `includes`, e só podia ser testada pela tela.
- **Refactoring aplicado:** Move Function + Replace Conditional with Lookup Table. A função foi para o `utils.js` e as palavras-chave passaram para um mapa `PALAVRAS_CHAVE` (categoria → palavras). A troca da cadeia de `if` por uma lista de regras já tinha entrado no PR #28, junto com o suporte a acentos e a palavra "ifood".
- **Por quê:** adicionar uma regra agora é só uma linha no mapa, sem mexer na função. Fora do componente, ela ganhou testes unitários em `utils.test.js` (incluindo um caso sem correspondência), e o comportamento não muda.
- **PR:** https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/30

### Filtro de período dentro do Dashboard

- **Smell:** Long Method (JSX longo) e regra de exibição escondida no meio da tela. Os três selects (semana/mês/ano, mês e ano) e a condição de quando cada um aparece ficavam misturados com o resto do `Dashboard.js`.
- **Refactoring aplicado:** Extract Component. Foi criado `FiltroPeriodo.js`, que recebe o filtro, o mês, o ano e suas funções de alteração por props. A constante `MESES` foi para dentro dele.
- **Por quê:** a regra de qual select aparece em cada filtro (RF05) fica em um só lugar, e o `Dashboard.js` só liga o componente ao estado.
- **PR:** https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/31

## Organização do projeto

Usamos Scrum no Jira. Link do quadro: [https://cabralrenata18.atlassian.net/jira/software/projects/RF/boards/3/backlog?selectedIssue=RF-6](https://cabralrenata18.atlassian.net/jira/software/projects/RF/boards/3/backlog?selectedIssue=RF-6)

Integrantes: Debora de Farias Negri e Renata Bernardes Cabral