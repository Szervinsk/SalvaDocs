# SalvaDocs 📄✨

Analisador de documentos com IA integrada, projetado para otimizar a extração de dados e o gerenciamento de informações. O SalvaDocs é uma aplicação web dinâmica que permite ao usuário customizar modelos de análise, tags de extração e a organização em pastas de acordo com suas necessidades.



***

## 💡 Visão Geral

O SalvaDocs automatiza o processo de leitura e extração de informações de documentos PDF. Utilizando expressões regulares e o poder da IA generativa (Google Gemini), a plataforma identifica e cataloga dados-chave, organizando-os de forma inteligente para fácil acesso e gerenciamento.

***

## ✨ Funcionalidades

* **Análise Inteligente de Documentos:** Extraia informações de arquivos PDF usando Regex ou IA.
* **Gerenciamento Completo:** Crie, edite e exclua seus próprios Modelos, Tags e Pastas.
* **Visualizador de PDF Integrado:** Visualize o documento original lado a lado com os dados extraídos.
* **Autenticação Segura:** Sistema completo de registro, login e gerenciamento de sessão com JWT e cookies `httpOnly`.
* **Interface Reativa e Moderna:** Construído com React e animado com Framer Motion para uma experiência de usuário fluida.
* **Dashboard de Análise:** Acompanhe estatísticas de uso, como documentos processados e modelos mais utilizados.
* **Monitor de API:** Uma ferramenta de desenvolvimento para testar e visualizar as respostas das rotas da API em tempo real.

***

## 🚀 Tecnologias Utilizadas

O projeto é um monorepo dividido em `frontend` e `backend`.

### **Frontend**
* **React:** Biblioteca principal para a construção da interface.
* **Axios:** Para realizar as requisições HTTP para o backend.
* **Framer Motion:** Para animações fluidas e transições de página.
* **CSS Moderno:** Variáveis CSS para theming (light/dark) e layout com Flexbox/Grid.

### **Backend**
* **Node.js:** Ambiente de execução do servidor.
* **Express.js:** Framework para a construção da API REST.
* **Sequelize:** ORM para interação com o banco de dados.
* **Google Gemini API:** Para as funcionalidades de extração de dados com Inteligência Artificial.
* **Autenticação:** JWT (JSON Web Tokens) para controle de sessão.
* **Segurança:** `helmet` para proteção contra vulnerabilidades comuns, `bcryptjs` para hashing de senhas.
* **Upload de Arquivos:** `multer` para gerenciar o upload de PDFs.

### **Banco de Dados**
* **SQLite:** Para o ambiente de desenvolvimento.
* **PostgreSQL:** Recomendado para produção.

***

## 🏁 Começando

Siga os passos abaixo para configurar e executar o projeto localmente.

### **Pré-requisitos**
* Node.js (v18.x ou superior)
* Git

### **Instalação**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Szervinsk/SalvaDocs.git
    cd SalvaDocs
    ```

2.  **Instale as dependências do Backend:**
    ```bash
    cd backend
    npm install
    ```

3.  **Instale as dependências do Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### **Configuração de Ambiente (`.env`)**

Você precisará de dois arquivos `.env`: um para o backend e um para o frontend.

1.  **Backend:** Na pasta `/backend`, crie um arquivo `.env` com as seguintes variáveis:
    ```env
    # Porta do servidor
    PORT=5000

    # Segredos para os tokens JWT (use valores longos e aleatórios)
    JWT_SECRET=seu_segredo_super_secreto_aqui
    JWT_REFRESH_SECRET=outro_segredo_ainda_mais_secreto

    # Chave da API do Google Gemini
    GEMINI_API_KEY=sua_chave_da_api_gemini
    ```

2.  **Frontend:** Na pasta `/frontend`, crie um arquivo `.env` para a URL da API:
    ```env
    # URL base da sua API backend
    VITE_API_BASE_URL=http://localhost:5000
    ```

### **Executando a Aplicação**

1.  **Prepare o Banco de Dados:** A partir da pasta `/backend`, execute os scripts para criar e popular o banco de dados.
    ```bash
    # (Opcional) Limpa e recria as tabelas do zero
    npm run reset

    # Adiciona os dados iniciais (modelos, tags, pastas)
    npm run seed
    ```

2.  **Inicie os Servidores:** A partir da pasta **raiz** do projeto, você pode iniciar ambos os servidores (frontend e backend) com um único comando (recomendado instalar `concurrently`):
    ```bash
    # Se tiver 'concurrently' instalado globalmente ou no projeto
    npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
    ```
    Alternativamente, abra dois terminais e execute os comandos separadamente.

***

## 🤝 Contribuição

Contribuições são bem-vindas! Se você tiver sugestões ou encontrar bugs, por favor, abra uma *issue* no repositório.

***

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

***

## 🧑‍💻 Desenvolvedores

* **Matheus Szervinsk**  
    [@Szervinsk](https://github.com/Szervinsk)

* **Augusto Soares**  
    [@Augustossn](https://github.com/Augustossn)

* **Repositório do Projeto:**  
    [SalvaDocs](https://github.com/Szervinsk/SalvaDocs)
