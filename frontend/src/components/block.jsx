import AnalisarArquivos from "./analisa-arquivos";

function Block({ path, types }) {
  return (
    <div className="background">
      <div className="action-bar">
        <div className="select">
          <h3>selecionar algo...</h3>
        </div>
      </div>

      <div className="middle-area">
        <AnalisarArquivos />
      </div>
      <div className="status-bar">
        <button className="Status-btn">Salvar modificações</button>
      </div>
    </div>
  );
}
export default Block;
