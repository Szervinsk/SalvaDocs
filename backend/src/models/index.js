import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

// Importações dos models
import DocumentModel from "./documentos.js";
import ModeloDef from "./modelos.js";
import TagInstanceDef from "./tagInstance.js";
import TagBaseDef from "./tagBase.js";
import UserModel from "./user.js";
import FolderModel from "./folder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// O caminho do banco de dados agora é dinâmico.
// 1. Ele tenta usar a variável de ambiente 'DB_STORAGE_PATH' (fornecida pelo main.js no executável).
// 2. Se essa variável não existir (como no modo de desenvolvimento), ele usa o caminho padrão na raiz do projeto.
const storagePath =
  process.env.DB_STORAGE_PATH || path.join(process.cwd(), "database.sqlite");

console.log(`[Sequelize] Usando banco de dados em: ${storagePath}`); // Log para depuração

// Configuração da conexão com o banco de dados (SQLite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath, // Usa o caminho dinâmico que definimos acima
  logging: false,
});

// Inicialização de todos os models
const models = {
  Document: DocumentModel(sequelize),
  Modelo: ModeloDef(sequelize),
  TagInstance: TagInstanceDef(sequelize),
  TagBase: TagBaseDef(sequelize),
  User: UserModel(sequelize),
  Folder: FolderModel(sequelize),
};

// Executa a função .associate() de cada model para criar os relacionamentos
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

// Exporta a instância do sequelize e o objeto com todos os models
export { sequelize };
export default models;
