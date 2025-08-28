import { Icons } from "../constants/icons";

function ActionBar({
  docSelecionado,
  selectedModel,
  selectedTags,
  etapaAtual,
  file,
  setMore,
  more,
  setTool
}) {
  return (
    <div className="action-bar">
      <div className="select">
        <div className="flex-left-right">
          {/* 1 Documento selecionado */}
          {docSelecionado && !selectedModel && (
            <div className="flex-left-right">
              <div className="flex-down-top">
                <h4>Arquivo selecionado</h4>
                <div className="flex-left-right" style={{ marginTop: 5 }}>
                  <Icons.Selected size={15} className="controle" />
                  <h3 className="controle">
                    {docSelecionado.templateName
                      ? docSelecionado.templateName
                      : docSelecionado.name}
                  </h3>
                </div>
              </div>

              {/* barra para separar */}
              <div style={{ margin: "0 20px" }}>|</div>
            </div>
          )}

          {/* 2 Modelo selecionado */}
          {selectedModel && !docSelecionado && (
            <div className="flex-down-top" style={{ margin: "0 20px 0 0" }}>
              <h4>Selecionar modelo</h4>
              <div className="flex-left-right" style={{ marginTop: 5 }}>
                <Icons.Selected size={15} className="controle" />
                <h3 className="controle">
                  Modelo {selectedModel?.name} selecionado
                </h3>
              </div>
            </div>
          )}

          {/* 3 Quantidade de tags */}
          {selectedModel && selectedTags?.length >= 1 && etapaAtual >= 2 && (
            <div className="flex-down-top" style={{ margin: "0 20px" }}>
              <h4>Quantidade de tags</h4>
              <div className="flex-left-right" style={{ marginTop: 5 }}>
                <Icons.Tags size={15} className="icons" />
                <h3>{selectedTags.length} tags selecionadas</h3>
              </div>
            </div>
          )}

          {/* 4 Arquivo selecionado na etapa 3 */}
          {etapaAtual === 3 && file && (
            <div className="flex-down-top" style={{ marginLeft: 20 }}>
              <h4>Arquivo selecionados</h4>
              <div className="flex-left-right" style={{ marginTop: 5 }}>
                <Icons.FiFileText size={15} className="controle" />
                <h3 className="controle">{file.name}</h3>
              </div>
            </div>
          )}

          {/* 5️ Caso nada esteja selecionado */}
          {!docSelecionado && !selectedModel && (
            <div>
              <h3>Selecione algo</h3>
            </div>
          )}
        </div>

        <div className="spc-bet flex-left-right" style={{ width: "9%" }}>
          <button className="action-btns">
            <Icons.Add size={20} onClick={() => setTool(1)} />
          </button>
          <button className="action-btns">
            <Icons.MdOutlineMoreHoriz
              size={20}
              onClick={() => setMore(!more)}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionBar;
