import AnalisarArquivos from "./analisa-arquivos";
import FoldersAction from "./folders-action";

function Block({ path, types, pastas}) {
  const ultimoItem = path[path.length - 1];
  console.log("Types no block:", types);
  console.log("Path no block:", path);

  return (
    <div className="background">
      <div className="action-bar">
        <div className="select">
          <h3>selecionar algo...</h3>
        </div>
      </div>

      <div className="middle-area">
        {ultimoItem === "Pastas" && (
          <FoldersAction pastas={pastas}/>
        )}
        <div className="content-area">
          {ultimoItem === "Analisar arquivos" && <AnalisarArquivos />}
        </div>
      </div>

      <div className="status-bar">
        <button className="Status-btn">Salvar modificações</button>
      </div>
    </div>
  );
} export default Block;

