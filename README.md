# Rastreador de Gastos

App de controle financeiro pessoal. Você registra o que entra e o que sai e vê no dashboard para onde seu dinheiro está indo.

## Descrição

O objetivo do projeto é facilitar o controle dos gastos cotidianos. Cada transação pode ser cadastrada com descrição, valor, data, categoria e tipo (entrada ou saída), permitindo o acompanhamento de gráficos de gastos por categoria, com filtros por semana, mês ou ano.

## Metodologia

Usamos **Scrum**, com o backlog e o quadro no Jira (link no fim deste arquivo). Cada funcionalidade vira uma história de usuário com critérios de aceite no formato Dado / Quando / Então, e o fluxo de trabalho é sempre o mesmo:

1. A história entra no backlog com prioridade e critérios de aceite.
2. Criamos uma branch para cada tarefa, com prefixo que indica o tipo: `feature/`, `fix/`, `refactor/`, `test/`, `ci/` ou `docs/`.
3. Os commits são pequenos e seguem o mesmo padrão de prefixo (`feat:`, `fix:`, `refactor:`, `test:`, `ci:`, `docs:`).
4. Antes de commitar, rodamos `npm run test:ci` e conferimos a tela com `npm start`.
5. A mudança vai para a `main` por Pull Request, nunca por push direto.
6. O Jenkins roda a cada alteração e só publica a imagem Docker quando o código chega na `main`.

## Histórias de usuário

### HU01: Cadastrar transação

- **Prioridade:** Alta
- **Status:** Feito
- **História:** como usuário, quero registrar uma entrada ou saída com descrição, valor, categoria e data, para controlar meu dinheiro.
- **Critérios de aceite:**
  - **Dado** o formulário preenchido corretamente, **quando** eu enviar, **então** a transação é salva e o formulário é limpo.
  - **Dado** um valor igual ou menor que zero, **quando** eu enviar, **então** vejo a mensagem "Informe um valor maior que zero."
  - **Dado** a descrição vazia, **quando** eu enviar, **então** vejo a mensagem "Informe uma descrição."
- **PR:** [#26](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/3)

### HU02: Gráfico de gastos por categoria

- **Prioridade:** Alta
- **Status:** Feito
- **História:** como usuário, quero ver um gráfico dos meus gastos por categoria, para saber onde gasto mais.
- **Critérios de aceite:**
  - **Dado** que existem transações de saída, **quando** abro o dashboard, **então** o gráfico mostra o total gasto por categoria.
  - **Dado** transações do tipo entrada, **quando** o gráfico é montado, **então** elas não entram nele.
  - **Dado** que cadastro uma nova saída, **quando** o formulário é enviado, **então** o gráfico atualiza sem recarregar a página.
  - **Dado** que não há transações no período, **quando** abro o dashboard, **então** o gráfico aparece vazio, sem erro.
- **PR:** [#25](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/4)


### HU03: Filtrar por período
- **Prioridade:** Média
- **Status:** Feito
- **História:** como usuário, quero filtrar o dashboard por semana, mês ou ano, para analisar períodos diferentes.
- **Critérios de aceite:**
  - **Dado** o filtro "Semana", **quando** ele é aplicado, **então** aparecem só as transações dos últimos 7 dias.
  - **Dado** o filtro "Mês" com um mês e um ano escolhidos, **quando** ele é aplicado, **então** aparecem só as transações daquele mês.
  - **Dado** o filtro "Ano" com um ano escolhido, **quando** ele é aplicado, **então** aparecem só as transações daquele ano.
  - **Dado** que troco o filtro, **quando** a tela atualiza, **então** o gráfico, a lista e o total gasto mudam junto.
- **PR:** [#19](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/6) 


### HU04: Receber sugestão automática de categoria
- **Prioridade:** Média
- **Status:** Feito
- **História:** como usuário, quero que o app sugira a categoria ao digitar a descrição, para lançar gastos mais rápido sem escolher a categoria manualmente.
- **Critérios de aceite:**
  - **Dado** que digitei "Uber" ou "Posto de gasolina" na descrição, **quando** saio do campo, **então** a categoria "Transporte" é pré-selecionada.
  - **Dado** que digitei "Supermercado" ou "Ifood", **quando** saio do campo, **então** a categoria "Alimentação" é pré-selecionada.
  - **Dado** que o app sugeriu uma categoria, **quando** escolho outra manualmente, **então** a minha escolha é a que vale ao salvar.
- **PR:** [#28](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/20) 


### HU05: Definir limite de gastos com alerta

- **Prioridade:** Média
- **Status:** Feito
- **História:** como usuário, quero definir um limite de gastos, para ser avisado quando passar do meu orçamento.
- **Critérios de aceite:**
  - **Dado** que estou no dashboard, **quando** informo um limite maior que zero, **então** o limite fica salvo e visível na tela.
  - **Dado** um limite igual a zero ou vazio, **quando** tento confirmar, **então** vejo a mensagem "Informe um valor maior que zero."
  - **Dado** que o gasto do período passou do limite, **quando** vejo o dashboard, **então** aparece o alerta "Limite de gastos ultrapassado!" com o valor excedido.
  - **Dado** que o gasto está dentro do limite, **quando** vejo o dashboard, **então** nenhum alerta aparece.
- **PR:** # (https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/23)

### HU06: Editar e excluir transações

- **Prioridade:** Alta
- **Status:** Feito
- **História:** como usuário, quero corrigir ou apagar uma transação lançada errada, para manter meus dados certos.
- **Critérios de aceite:**
  - **Dado** uma transação na lista, **quando** clico em "Editar", **então** o formulário abre preenchido com os dados dela.
  - **Dado** que alterei os campos, **quando** clico em "Salvar alterações", **então** a transação é atualizada no banco e a lista atualiza.
  - **Dado** que cliquei em "Cancelar edição", **quando** o formulário fecha, **então** os campos são limpos.
  - **Dado** que clico em "Excluir" e confirmo, **quando** a exclusão termina, **então** a transação some da lista.
- **PR:** # (https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/25)

### HU07: Aprender com as correções do usuário

- **Prioridade:** Baixa
- **Status:** A fazer
- **História:** como usuário, quero que o app lembre das categorias que eu corrigi, para que as próximas sugestões acertem mais.
- **Critérios de aceite:**
  - **Dado** que corrigi a categoria sugerida para uma descrição, **quando** digito uma descrição igual depois, **então** o app sugere a categoria que escolhi.
- **PR:** ainda não há


## Requisitos funcionais

- **RF01:** cadastrar uma transação com descrição, valor, data, categoria e tipo (entrada ou saída).
- **RF02:** não permitir o cadastro com descrição ou data vazia, nem com valor menor ou igual a zero, mostrando uma mensagem de erro.
- **RF03:** oferecer categorias prontas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário e Outros.
- **RF04:** mostrar no dashboard um gráfico com o total de saídas por categoria.
- **RF05:** filtrar o dashboard por semana, mês ou ano.
- **RF06:** sugerir a categoria com base na descrição digitada.
- **RF07:** guardar as correções de categoria e usar nas próximas sugestões (em desenvolvimento).
- **RF08:** definir um limite de gastos e avisar visualmente quando passar dele.
- **RF09:** editar e excluir transações já cadastradas.

## Requisitos não funcionais

- **RNF01 (usabilidade):** o lançamento de uma transação deve ser feito em uma tela só, em português e com valores em reais.
- **RNF02 (desempenho):** o dashboard deve atualizar logo após cadastrar uma transação ou trocar o filtro.
- **RNF03 (compatibilidade):** funcionar nos navegadores mais usados (Chrome, Firefox, Edge e Safari).
- **RNF04 (manutenção):** código dividido em componentes React, com as regras de cálculo separadas em funções próprias.
- **RNF05 (qualidade):** ter testes automatizados que rodam no Jenkins a cada alteração.
- **RNF06 (segurança):** as chaves de acesso não ficam no repositório. O isolamento dos dados por usuário ainda não existe, porque o app não tem login.

## Tecnologias

- React
- Chart.js (gráficos)
- Supabase (banco de dados)
- Jest e Testing Library (testes)
- Jenkins (CI/CD)
- Docker, nginx e Docker Hub (empacotamento e distribuição)
- Jira (organização com Scrum)

## Como rodar

### Localmente

Crie o arquivo `rastreador-financeiro/.env` com as chaves do Supabase (ele não vai para o repositório):

```
REACT_APP_SUPABASE_URL=<url do projeto>
REACT_APP_SUPABASE_ANON_KEY=<chave anon>
```

Depois:

```bash
cd rastreador-financeiro
npm install
npm start
```

O app abre em [http://localhost:3000](http://localhost:3000). Para rodar os testes: `npm run test:ci`.

### Com Docker (imagem pronta)

A imagem já tem as chaves embutidas, então basta ter o Docker instalado:

```bash
docker run -p 8081:80 renata1821/rastreador-financeiro:entrega
```

Depois abra [http://localhost:8081](http://localhost:8081). Se a porta 8081 estiver ocupada, troque o primeiro número (por exemplo, `-p 9000:80`).

Imagem no Docker Hub: https://hub.docker.com/r/renata1821/rastreador-financeiro


## Uso de IA

O grupo usou IA como apoio no desenvolvimento. 
| Ferramenta | Modelo | Quem usou |
|---|---|---|
| Claude (claude.ai, chat) | Claude Sonnet 5.5 | Débora |
| Claude (claude.ai, chat) | Claude Sonnet 5.5 | Renata |

### Dinâmica de uso

- Enviávamos a captura de tela do erro, pedido de ajuda no desenvolvimento, dúvidas sobre as funcionalidades e descrevíamos o que queríamos.
- Pedíamos mudanças pequenas e explicadas, para entender o que cada trecho fazia.
- A IA entregava  os arquivos alterados, junto com a explicação de cada mudança.
- Lemos o código, rodamos `npm test` e conferimos a tela com `npm start` antes de fazer commit.
- Quando a IA afirmava algo que dava para conferir (como o conteúdo de uma imagem Docker), rodamos o comando e corrigimos quando ela errava.  As mudanças foram enviadas por Pull Request.

### Exemplos de prompts

#### Débora

**1. Conflito de merge no PR do filtro por período**

Prompt (com captura da tela do GitHub):

> "No meu outro pull request, onde adicionei a funcionalidade de filtrar por periodo esta dando conflito, me ajude a resolver sem alterar as funcionalidades do projeto atualmente. O conflito esta no arquivo utils.js"

Resposta da IA: explicou que a main tinha corrigido uma linha do filtro de ano enquanto a branch reescrevia a função inteira, e indicou usar "Accept current change". A IA reproduziu o merge localmente e conferiu que o resultado era idêntico à versão da branch.

Decisão: aceita. O PR #19 foi resolvido dessa forma e integrado à main.

**2. Comparar o plano do projeto com o código**

Prompt:

> "Tem alguma funcionalidade deste plano do projeto que ainda não foi implementada no projeto real? Me informe quais funcionalidades ainda faltam ser implementadas"

Resposta da IA: lista do que faltava (persistência, edição/exclusão, aprendizado com correções, exportação de relatório, forma de pagamento, orçamento por categoria) e das divergências entre o plano e o projeto (CircleCI × Jenkins, IndexedDB × Supabase).

Decisão: aceita. Usada para escolher a próxima funcionalidade (edição e exclusão).

**3. Edição e exclusão de transações**

Prompt:

> "Quero que me ajude a implementar a Edição e exclusão de transações. Lembrando que a implementaçao deve ser de forma simples, pois preciso entender como foi feito. Me explique passo a passo"

Resposta da IA: uma lista de transações que alterava apenas o estado local (useState), feita sobre a main daquele momento.

Decisão: descartada. O projeto já tinha passado a usar o Supabase, então editar e excluir precisavam alterar o banco.

#### Renata
 
### 1. Análise do log do build #4 do Jenkins
**Prompt** (com o log em anexo):
> "O build #4 do Jenkins terminou com falha. Segue o log; qual foi a causa?" 

Resposta da IA: constatou que o stage "Publicar imagem" funcionou (push das tags `4` e `latest`) e que a falha foi o timeout de 20 minutos, causado pelo `npm ci` executado duas vezes. Sugeriu remover a repetição e aumentar o timeout. 

Decisão: Aceita.
 
### 2. Erro `agora.getFullYear is not a function`
**Prompt**:
> "Ao executar a aplicação, ocorre o erro `agora.getFullYear is not a function`. Segue o código do Dashboard. Como corrigir?" 

Resposta da IA: identificou que o `Dashboard` passava `mesSelecionado` como terceiro argumento de `filtrarPorPeriodo`, que espera uma data; corrigiu a chamada para `(transacoes, filtro, hoje, { ano, mes })`, removeu o `setAnoSelecionado` sem uso e entregou as alterações.

Decisão: Aceita.
 
### 3. Acesso ao Jenkins e credencial do Docker Hub
**Prompt:**
> "Não estou conseguindo acessar a interface do Jenkins que utilizei na entrega anterior, não esta encontrando o Jenkins na maquina. Como iniciá-lo novamente? Além disso, o que é o token solicitado para a credencial `dockerhub`?" 

Resposta da IA: orientou a localizar o `jenkins.war` e iniciá-lo com `java -jar`; explicou o Access Token do Docker Hub e como criar a credencial `dockerhub` (usuário e senha) no Jenkins. 

Decisão: Aceita. 

### 4. Gráfico e total não atualizam após cadastrar transações
**Prompt** :
> "Os dados chegam ao Supabase, mas o gráfico e o valor do cálculo não refletem as alterações das transações. Qual pode ser a causa?"

Resposta da IA: listou causas prováveis (nome da tabela, nomes das colunas, ausência de policy de `SELECT` no RLS, chamada do `onAdd`) e sugeriu logs de diagnóstico. A primeira hipótese (formato do campo `tipo`) estava errada, pois o formulário já gravava `'saida'`, e foi corrigida ao analisar o `Transactionform`. Sugeriu também recarregar do banco após cadastrar e criar a policy de leitura.

Decisão:  : Aceita, o formato estava errado

## Refactorings

Esta seção registra as melhorias de código feitas sem alterar o comportamento do app. Cada refactoring é feito em uma branch própria (`refactor/...`), com testes passando antes do commit e conferência manual da tela. Para cada um são indicados o smell encontrado, o refactoring aplicado, o motivo e o link do pull request.

### Regras de cálculo e formatação dentro do Dashboard

- **Smell:** Long Method / Large Component. O `Dashboard.js` misturava a tela com contas (total gasto, lista de anos) e com a formatação de valores em reais.
- **Refactoring aplicado:** Extract Function. As funções `formatarReais`, `calcularTotalGasto` e `listarAnos` foram movidas para o `utils.js`, e o `Dashboard.js` passou a chamá-las.
- **Por quê:** atende o RNF04 (regras de cálculo em funções próprias), deixa o componente mais curto e permite testar as contas sem renderizar a tela. Foram adicionados testes dessas funções em `utils.test.js`.
- **PR:** [#29](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/29)

### Código morto no projeto

- **Smell:** Dead Code. O `transactionService.js` ficou sem uso depois que o `Transactionform.js` e o `Dashboard.js` passaram a falar direto com o `supabaseClient`, e nada mais importava o arquivo.
- **Refactoring aplicado:** Remove Dead Code. O arquivo foi excluído, assim como a pasta duplicada do dashboard (`src/Dashboard.js`) em uma limpeza anterior.
- **Por quê:** havia dois caminhos para acessar os dados, o que gerava confusão e chegou a atrapalhar os testes, em que o mock do Supabase não batia com o que o código usava. Como nada importava o arquivo, o comportamento não muda.
- **PR:** [#28](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/28)

### Sugestão de categoria dentro do componente

- **Smell:** Conditional Complexity. A `sugerirCategoria` ficava dentro do `Transactionform.js`, com uma cadeia de `if` e vários `includes`, e só podia ser testada pela tela.
- **Refactoring aplicado:** Move Function + Replace Conditional with Lookup Table. A função foi para o `utils.js` e as palavras-chave passaram para um mapa `PALAVRAS_CHAVE` (categoria → palavras). A troca da cadeia de `if` por uma lista de regras já tinha entrado no PR #28, junto com o suporte a acentos e a palavra "ifood".
- **Por quê:** adicionar uma regra agora é só uma linha no mapa, sem mexer na função. Fora do componente, ela ganhou testes unitários em `utils.test.js` (incluindo um caso sem correspondência), e o comportamento não muda.
- **PR:** [#30](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/30)

### Filtro de período dentro do Dashboard

- **Smell:** Long Method (JSX longo) e regra de exibição escondida no meio da tela. Os três selects (semana/mês/ano, mês e ano) e a condição de quando cada um aparece ficavam misturados com o resto do `Dashboard.js`.
- **Refactoring aplicado:** Extract Component. Foi criado `FiltroPeriodo.js`, que recebe o filtro, o mês, o ano e suas funções de alteração por props. A constante `MESES` foi para dentro dele.
- **Por quê:** a regra de qual select aparece em cada filtro (RF05) fica em um só lugar, e o `Dashboard.js` só liga o componente ao estado.
- **PR:** [#31](https://github.com/C14-Inatel-2026-2/Rastreador-Financeiro/pull/31)

## Organização do projeto

Usamos Scrum no Jira. Link do quadro: [https://cabralrenata18.atlassian.net/jira/software/projects/RF/boards/3/backlog?selectedIssue=RF-6](https://cabralrenata18.atlassian.net/jira/software/projects/RF/boards/3/backlog?selectedIssue=RF-6)

Integrantes: Debora de Farias Negri e Renata Bernardes Cabral

