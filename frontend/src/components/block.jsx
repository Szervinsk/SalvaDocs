import { LuCircleDashed } from "react-icons/lu";
import { FaTags } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import AnalisarArquivos from "./analisa-arquivos";
import { useState, useEffect } from "react";

function Block({ modelos, selectedModel, setSelectedModel }) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [anexou, setAnexou] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  
  const [erroArquivo, setErroArquivo] = useState(false);
  const [alert, setAlert] = useState(false);
  const [tremer, setTremer] = useState(false);
  const [closeAlert, setCloseAlert] = useState(false);

  const etapas = [
    { id: 1, text: "Editar tags" },
    { id: 2, text: "Editar parâmetros de saída" },
    { id: 3, text: "Análise dos dados" },
  ];

  const triggerShake = () => {
    setErroArquivo(true);
    setTremer(true);
    setAlert(true);
    setTimeout(() => setTremer(false), 500);
    setTimeout(() => setAlert(false), 2500);
    setTimeout(() => setErroArquivo(false), 500);
  };

  const goToEtapa = (targetId) => {
    if (etapaAtual === 2 && targetId > etapaAtual && !anexou) {
      triggerShake();
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, etapas.length)));
  };

  const handleProxima = () => {
    if (etapaAtual === 2 && !anexou) {
      triggerShake();
    } else {
      setEtapaAtual((prev) => Math.min(prev + 1, etapas.length));
    }
  };

  const handleVoltar = () => {
    if (etapaAtual === 1) setSelectedModel(null);
    else setEtapaAtual((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedModel) return;
      if (e.key === "ArrowRight") handleProxima();
      else if (e.key === "ArrowLeft") handleVoltar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModel, etapaAtual, anexou]);

  return (
    <div className="background">
      {/* Action Bar */}
      <div className="action-bar">
        <div className="select">
          <div className="flex-left-right">
            {selectedModel ? (
              <>
                <div className="flex-down-top" style={{ margin: "0 20px 0 0" }}>
                  <h4>Selecionar modelo</h4>
                  <div className="flex-left-right" style={{ marginTop: 5 }}>
                    <LuCircleDashed size={15} className="controle" />
                    <h3 className="controle">Modelo {selectedModel} selecionado</h3>
                  </div>
                </div>
                |
                {(selectedTags?.length ?? 0) >= 1 && etapaAtual >= 2 && (
                  <>
                    <div className="flex-down-top" style={{ margin: "0 20px" }}>
                      <h4>Quantidade de tags</h4>
                      <div className="flex-left-right" style={{ marginTop: 5 }}>
                        <FaTags size={15} className="icons" />
                        <h3>{selectedTags.length} tags selecionadas</h3>
                      </div>
                    </div>
                    {etapaAtual === 3 && file && (
                      <>
                        |
                        <div className="flex-down-top" style={{ marginLeft: 20 }}>
                          <h4>Arquivo selecionado</h4>
                          <div className="flex-left-right" style={{ marginTop: 5 }}>
                            <FiFileText size={15} className="controle" />
                            <h3 className="controle">{file.name}</h3>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <div>
                <h3>selecione algo</h3>
              </div>
            )}
          </div>

          <div className="spc-bet flex-left-right" style={{ width: "9%" }}>
            <button className="action-btns">
              <IoMdAdd size={20} />
            </button>
            <button className="action-btns">
              <MdOutlineMoreHoriz size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Area */}
      <div className="middle-area">
        {selectedModel && (selectedTags?.length ?? 0) >= 1 && etapaAtual === 3 && !file && (
          <div className="alert">Nenhum arquivo foi anexado</div>
        )}

        <AnalisarArquivos
          modelos={modelos}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          etapas={etapas}
          etapaAtual={etapaAtual}
          setEtapaAtual={goToEtapa}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          file={file}
          setFile={(f) => {
            setFile(f);
            if (f) setAnexou(true);
          }}
          anexou={anexou}
          setAnexou={setAnexou}
          erroArquivo={erroArquivo}
          onBlocked={triggerShake}
          alert={alert}
          setAlert={setAlert}
          tremer={tremer}
          setTremer={setTremer}
          closeAlert={closeAlert}
          setCloseAlert={setCloseAlert}
        />
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        {selectedModel ? (
          <div className="spc-bet">
            <div className="flex-top-down">
              <h4>Indicador de passos</h4>
              <div className="flex-left-right" style={{ marginTop: 10, alignItems: "center" }}>
                <LuCircleDashed size={15} style={{ marginRight: 10, color: "#597dff" }} />
                <h3 className="controle">{etapaAtual} de {etapas.length}</h3>
              </div>
            </div>
            <div className="flex-left-right">
              <button className="Status-btn" onClick={handleVoltar}>Voltar</button>
              {etapaAtual <= 2 && <button className="Status-btn" onClick={handleProxima}>Próxima</button>}
            </div>
          </div>
        ) : (
          <div>
            <button className="Status-btn" style={{ opacity: 0.5 }}>Salvar modificações</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Block;
