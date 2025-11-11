📄✨ SalvaDocs
Analisador de documentos com IA integrada, projetado para otimizar a extração de dados e o gerenciamento de informações.
O SalvaDocs é uma aplicação web dinâmica que permite ao usuário customizar modelos de análise, tags de extração e a organização em pastas de acordo com suas necessidades.
💡 Visão Geral
O SalvaDocs automatiza o processo de leitura e extração de informações de documentos PDF.
Utilizando expressões regulares e o poder da IA generativa (Google Gemini), a plataforma identifica e cataloga dados-chave, organizando-os de forma inteligente para fácil acesso e gerenciamento.
✨ Funcionalidades
Análise Inteligente de Documentos: Extraia informações de arquivos PDF usando Regex ou IA.
Gerenciamento Completo: Crie, edite e exclua Modelos, Tags e Pastas personalizadas.
Visualizador de PDF Integrado: Compare o documento original com os dados extraídos, lado a lado.
Autenticação Segura: Registro, login e controle de sessão com JWT e cookies httpOnly.
Interface Reativa e Moderna: Desenvolvido em React, com animações usando Framer Motion.
Dashboard de Análise: Monitore estatísticas como documentos processados e modelos mais usados.
Monitor de API: Ferramenta integrada para testar rotas da API e visualizar respostas em tempo real.
🚀 Tecnologias Utilizadas
Frontend
React
Axios
Framer Motion
React Router DOM
CSS moderno (Flexbox / Grid e theming Light/Dark)
Backend
Node.js + Express.js
Sequelize (ORM)
Google Gemini API (IA generativa)
JWT + bcryptjs (autenticação e segurança)
helmet + cors + express-rate-limit
multer (upload de PDFs)
Banco de Dados
SQLite (desenvolvimento)
PostgreSQL (produção recomendada)
🏁 Começando
🔧 Pré-requisitos
Node.js v18.x ou superior
Git instalado
⚙️ Instalação
Clone o repositório:
git clone https://github.com/Szervinsk/SalvaDocs.gitcd SalvaDocs
🔹 Backend
cd backend
npm install
🔹 Frontend
cd ../frontend
npm install
⚙️ Configuração de Ambiente
Crie dois arquivos .env, um para backend e outro para frontend.
📁 /backend/.env
# Porta do servidor
PORT=5000
# Segredos JWT (use valores longos e aleatórios)
JWT_SECRET=seu_segredo_super_secreto_aqui
JWT_REFRESH_SECRET=outro_segredo_ainda_mais_secreto
# Chave da API do Google Gemini
GEMINI_API_KEY=sua_chave_da_api_gemini
📁 /frontend/.env
# URL base da API backend
VITE_API_BASE_URL=http://localhost:5000
🗃️ Banco de Dados
Antes de iniciar o servidor, prepare o banco de dados:
cd backend
🔹 Recriar tabelas do zero:
npm run reset
🔹 Popular com dados iniciais (modelos, tags, pastas):
npm run seed
🖥️ Executando a Aplicação
🟢 Opção 1 — Rodar manualmente (em dois terminais)
Terminal 1 (backend):
cd backend
npm run dev
Terminal 2 (frontend):
cd frontend
npm start
⚡ Opção 2 — Rodar ambos com um comando (recomendado)
Instale o concurrently (uma vez só):
npm install concurrently --save-dev
E depois execute da pasta raiz:
npx concurrently "cd backend && npm run dev" "cd frontend && npm start" 
💡 Isso sobe o backend na porta 5000 e o frontend na 3000 ao mesmo tempo.
🧩 Estrutura do Projeto
SalvaDocs/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── scripts/
│   │   ├── seed.js
│   │   └── sync.js
│   └── .env│
├── frontend/
│   ├── src/
│   ├── public/
│   └── .env│
└── README.md
🤝 Contribuição
Contribuições são bem-vindas!
Para sugerir melhorias, relatar bugs ou enviar PRs:
Faça um fork do repositório
Crie uma branch (git checkout -b feature/nova-funcionalidade)
Faça commit das mudanças
Envie um PR para revisão 🚀
📝 Licença
Este projeto está sob a licença MIT.
Consulte o arquivo LICENSE para mais detalhes.
👨‍💻 Desenvolvedores
Matheus Szervinsk
GitHub: @Szervinsk

Augusto Soares
GitHub: @Augustossn


Repositório: SalvaDocs
