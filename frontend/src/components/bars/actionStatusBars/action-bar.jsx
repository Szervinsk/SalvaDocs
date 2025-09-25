import { Icons } from "../../../constants/icons";
import SearchBar from "../searchBar/searchbar";

function ActionBar({
  docSelecionado,
  selectedModel,
  setDocSelecionado,
  selectedTags,
  etapaAtual,
  file,
  setMore,
  more,
  setTool,
  tool,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="action-bar">
      <div className="select">
        <div className="flex-row" style={{ width: "80%" }}>
          {/* 1 Documento selecionado */}
          {docSelecionado && !selectedModel && tool === 6 && (
            <div className="flex-row">
              <div className="flex-col">
                <h4>Arquivo selecionado</h4>
                <div className="flex-row" style={{ marginTop: 5 }}>
                  <Icons.Selected size={15} className="controle" />
                  <h3 className="controle">
                    {docSelecionado.templateName
                      ? docSelecionado.templateName
                      : docSelecionado.name}
                  </h3>
                </div>
              </div>
              <div style={{ margin: "0 20px" }}>|</div>
            </div>
          )}

          {/* 2 Modelo selecionado */}
          {selectedModel && !docSelecionado && (
            <div className="flex-col" style={{ margin: "0 20px 0 0" }}>
              <h4 style={{fontSize: "var(--font-size-xs"}}>Selecionar modelo</h4>
              <div className="flex-row" style={{ marginTop: 5 }}>
                <Icons.Selected size={15} className="controle" />
                <h3 className="controle" style={{fontSize: "var(--font-size-sm"}}>
                  Modelo {selectedModel?.name} selecionado
                </h3>
              </div>
            </div>
          )}

          {/* 3 Quantidade de tags */}
          {selectedModel && selectedTags?.length >= 1 && etapaAtual >= 2 && (
            <div className="flex-col" style={{ margin: "0 20px" }}>
              <h4 style={{fontSize: "var(--font-size-xs"}}>Quantidade de tags</h4>
              <div className="flex-row" style={{ marginTop: 5 }}>
                <Icons.Tags size={15} className="icons" />
                <h3 style={{fontSize: "var(--font-size-sm"}}>{selectedTags.length} tags selecionadas</h3>
              </div>
            </div>
          )}

          {/* 4 Arquivo selecionado na etapa 3 */}
          {etapaAtual === 3 && file && (
            <div className="flex-col" style={{ marginLeft: 20 }}>
              <h4 style={{fontSize: "var(--font-size-xs"}}>Arquivo selecionado</h4>
              <div className="flex-row" style={{ marginTop: 5 }}>
                <Icons.FiFileText size={15} className="controle" />
                <h3 className="controle" style={{fontSize: "var(--font-size-sm"}}>{file.name}</h3>
              </div>
            </div>
          )}

          {/* 5 Caso nada esteja selecionado */}
          {!docSelecionado && !selectedModel && tool !== 1 && (
            <div>
              <h3 style={{fontSize: "var(--font-size-sm"}}>Selecione algo</h3>
            </div>
          )}

          {tool === 1 && (
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder={"Pesquise seus arquivos..."}
            />
          )}
        </div>

        <div className="space-between flex-row" style={{ width: "8%"}}>
          <button
            className="btn-secondary"
            onClick={() => {
              setDocSelecionado(null);
              setTool(2);
            }}
          >
            <Icons.Add size={20} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setMore(!more);
              alert("abrir o more");
            }}
          >
            <Icons.MdOutlineMoreHoriz size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionBar;
