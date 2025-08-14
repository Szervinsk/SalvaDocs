import { LuCircleDashed } from "react-icons/lu";
import AnalisarArquivos from "./analisa-arquivos";
import { useState, useEffect } from "react";

function Block({
  path,
  types,
  pastas,
  modelos,
  selectedModel,
  setSelectedModel,
}) {
  const [etapaAtual, setEtapaAtual] = useState(1);

  const etapas = [
    { id: 1, text: "Editar tags" },
    { id: 2, text: "Editar parâmetros de saída" },
    { id: 3, text: "Análise dos dados" },
  ];

  const handleProxima = () => {
    setEtapaAtual((prev) => Math.min(prev + 1, etapas.length));
  };

  const handleVoltar = () => {
    // Se já está na etapa 1 e voltar, volta para escolher modelo
    if (etapaAtual === 1) {
      setSelectedModel(null);
    } else {
      setEtapaAtual((prev) => Math.max(prev - 1, 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedModel) return; // só responde se já tiver modelo escolhido

      if (e.key === "ArrowRight") {
        handleProxima();
      } else if (e.key === "ArrowLeft") {
        handleVoltar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModel, etapaAtual]);

  return (
    <div className="background">
      <div className="action-bar">
        <div className="select">
          {selectedModel ? (
            <>
              <h4>selecionar modelo</h4>
              <div className="flex-left-right" style={{ marginTop: 10 }}>
                <LuCircleDashed
                  size={15}
                  style={{ marginRight: "10px", color: "#597dff" }}
                />
                <h3 className="controle">Modelo {selectedModel} selecionado</h3>
              </div>
            </>
          ) : (
            <h3>selecione algo</h3>
          )}
        </div>
      </div>

      <div className="middle-area">
        <AnalisarArquivos
          modelos={modelos}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          etapas={etapas}
          setEtapaAtual={setEtapaAtual}
          etapaAtual={etapaAtual}
        />
      </div>

      <div className="status-bar">
        {selectedModel && (
          <div className="spc-bet">
            <div className="flex-top-down">
              <h4>Indicador de passos</h4>
              <div
                className="flex-left-right"
                style={{ marginTop: 10, alignItems: "center" }}
              >
                <LuCircleDashed
                  size={15}
                  style={{ marginRight: "10px", color: "#597dff" }}
                />
                <h3 className="controle">
                  {etapaAtual} de {etapas.length}
                </h3>
              </div>
            </div>

            <div className="flex-left-right">
              <button
                className="Status-btn"
                onClick={handleVoltar}
                disabled={etapaAtual === 1}
              >
                Voltar
              </button>
              <button
                className="Status-btn"
                onClick={handleProxima}
                disabled={etapaAtual === etapas.length}
              >
                Próxima
              </button>
            </div>
          </div>
        )}

        {!selectedModel && (
          <div>
            <button className="Status-btn" style={{ opacity: 0.5 }}>
              Salvar modificações
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Block;
