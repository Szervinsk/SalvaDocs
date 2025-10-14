# Backend da Aplicação de Análise de Documentos

Este é o servidor backend responsável por gerenciar a autenticação de usuários, o upload de arquivos, a extração de dados com IA e a persistência de informações em um banco de dados.

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados na sua máquina:
* [Node.js](https://nodejs.org/) (versão 18.x ou superior)
* [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

---

## 🚀 Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-do-seu-repositorio>
    ```

2.  **Instale as dependências:**
    Este comando irá instalar todos os pacotes necessários definidos no `package.json`, como Express, Sequelize, Nodemon, etc.
    ```bash
    npm install
    ```

---

## 📝 Configuração

O servidor utiliza variáveis de ambiente para configurações sensíveis.

1.  **Crie um arquivo `.env`** na raiz do projeto. A maneira mais fácil é copiar o arquivo de exemplo, se houver:
    ```bash
    cp .env.example .env
    ```
    *(Se não houver, crie um arquivo chamado `.env` manualmente).*

2.  **Adicione as variáveis de ambiente** necessárias ao arquivo `.env`. No mínimo, você precisará da `PORT`:
    ```env
    # Porta em que o servidor irá rodar
    PORT=5000

    # Adicione aqui outras variáveis que seu projeto possa precisar,
    # como chaves de API, segredos JWT ou a string de conexão do banco de dados.
    # DATABASE_URL=...
    # JWT_SECRET=...
    ```

---

## ▶️ Uso e Execução

O processo de inicialização é dividido em etapas. Execute os comandos na ordem correta a partir da raiz do seu projeto.

### 1. Resetar o Banco de Dados (Opcional)

Este passo **APAGA TODO O BANCO DE DADOS** e recria as tabelas do zero. Use este comando apenas quando precisar de uma instalação completamente limpa.

```bash
npm run reset
```

### 2. Popular o Banco de Dados (Seed)

Após resetar o banco (ou se as tabelas já estiverem criadas), execute este comando para adicionar os dados iniciais, como modelos, tags e pastas padrão.

```bash
npm run seed
```

### 3. Iniciar o Servidor

Com o banco de dados pronto, inicie o servidor em modo de desenvolvimento. Ele irá reiniciar automaticamente a cada alteração nos arquivos graças ao `nodemon`.

```bash
npm run dev
```

O servidor estará rodando no endereço `http://localhost:5000` (ou na porta que você definiu no arquivo `.env`).

---

## 📜 Scripts Disponíveis

* `npm run dev`: Executa o servidor em modo de desenvolvimento com `nodemon`.
* `npm start`: Executa o servidor em modo de produção (sem reinício automático).
* `npm run reset`: Executa o script que limpa e recria as tabelas do banco de dados (`sync.js`).
* `npm run seed`: Executa o script que popula o banco com dados iniciais (`seed.js`).