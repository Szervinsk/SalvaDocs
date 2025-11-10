# Log de Desenvolvimento do Projeto SalvaDocs

Este log registra a fila de tarefas pendentes (Backlog).

## 🚧 Backlog (Próximos Passos)

Os seguintes itens estão pendentes ou em desenvolvimento - use os seguintes emojis para ajustar (❌ (cancelado),🚧 (em desenvolvimento), ✅ (finalizado) )

### 1. Funcionalidades Essenciais (Prioridade Alta)

| ID | Status | Tarefa | Detalhes |
| :--- | :--- | :--- | :--- |
| **P1** | 🚧 | **Redefinição de Senha** | Criar a interface para redefinir senha (usuário logado). |
| **P2** | 🚧 | **Recuperação de Senha** | Criar a interface de "Esqueceu a Senha?" (fluxo de e-mail/token). |
| **P3** | 🚧 | **Limites no Upload** | Implementar limitadores no envio de arquivos (tamanho, tipo, quantidade). |
| **P4** | 🚧 | **Mudança das constantes** | Fazer migração das constantes para o banco de dados se cabível. |

### 2. Melhorias de Interface e UX (Prioridade Média)

| ID | Status | Tarefa | Detalhes |
| :--- | :--- | :--- | :--- |
| **U1** | 🚧 | **Edição Flutuante** | Arrumar a parte de edição de dados (barra lateral e menu de 3 pontinhos). |
| **U2** | ✅ | **Seleção de Modelo** | Ajustar a interface de seleção dos modelos (revisão final do design). |
| **U3** | ✅ | **Adicionar subtools dentro do navbar** | Ajustar a interface das tools na navbar (gerenciar, acesso direto ao modelo alonga para baixo) |
| **U4** | ✅ | **Ajuste do analisador de arquivos (pesquisa)** | Analisador de arquivos por meio da pesquisa, mostra modelos, quantidade, uso de tabs, autocomplete |
| **U5** | ✅ | **Melhorar interface de visualização dos dados gerais** | Separar por types nas tabelas  |
| **U6** | 🚧 | **Adicionar mais funções no actionbar superior** | Adicionar configuração de botões na barra de cima (personalizáveis)|
| **U7** | 🚧 | **Desenvolver interface de gerenciamento de modelos, tags e pastas** | Refatorar design da aba de gerenciamento para uma interface mais interativa sem a necessidade de modais...|

### 3. Features novas (Prioridade Média - feature nova)

| ID | Status | Tarefa | Detalhes|
| :--- | :--- | :--- | :--- |
| **B1** | 🚧 | **Adicionar bot de automação** | Arrumar rotas para o bot executar em segundo plano |
| **B2** | 🚧 | **Editar parâmetros das rotas** | O usuário terá acesso total aos parâmetros de entrada das rotas |
| **B3** | 🚧 | **Adicionar atalhos botões para executar as rotas** | Colocar atalhos para que ao analisar arquivos possa ter acesso aos outros documentos (quando tiver em rodada de salvamento) |
| **B4** | 🚧 | **Adicionar comandos para o bot/ outros bots** | Ter um bot, para abrir o relatório, abrir planilhas, adicionar endereços de pastas (ter controle) |
| **O1** | 🚧 | **Indicador de erros** | Indicar erro na captura de tags, salvar no registro de documentos |
| **O2** | 🚧 | **Solicitação de recaptura** | Pegar do registro as tags que não foram capturadas, requisita para IA procurar novamente, com modificações e e a atualiza documento com tags mais tags (não interfere nas antigas caso nn queira...) |
| **L1** | 🚧 | **Acesso a links** | Interface de atalhos para links importantes, acessar diretamente pelo aplicativo (adicionar por exemplo sistemas internos) |
| **T1** | 🚧 | **Ajuda IA para formação das tags, criação dos modelos** | Desenvolver método de auxílio com IA para formar as tags, prompt, regex|

### 4. Cobertura de testes

| ID | Status | Tarefa | Detalhes|
| :--- | :--- | :--- | :--- |
| **T1** | 🚧 | **Adicionar mais rotas no monitor de rotas** | Refatorar monitor de rotas |
| **T2** | 🚧 | **Testes para rotas** | Adicionar testes para testar as rotas |

### 5. Listas de bugs

| ID | Status | Tarefa | Detalhes|
| :--- | :--- | :--- | :--- |
| **B1** | ✅ | **Colocar os shortcuts corretos e atalhos** | Verificar rotas (setTools) |
| **B2** | 🚧 | **Testes para rotas** | Adicionar testes para testar as rotas e ajustar as rotas |
| **B3** | 🚧 | **Configurações não está configurando** | Verificar botões e funcionalidades do configurações |
| **B4** | ✅ | **Botões de seta não funcionando** | Setas pararam de funcionar na parte do analyse |