import { useEffect } from "react";
import { Icons } from "../../../constants/icons";
import { ETAPAS } from "../../../constants/constants";

function StatusBar({
  selectedModel,
  setSelectedModel,
  etapaAtual,
  setEtapaAtual,
  file, // <-- adicionar
  triggerShake,
  docSelecionado,
  setSelectedTags,
  tool,
}) {
  const handleProxima = () => {
    if (etapaAtual === 2 && !file) {
      // 🔹 checa file, não anexou
      triggerShake();
    } else {
      setEtapaAtual((prev) => Math.min(prev + 1, ETAPAS.length));
    }
  };

  const handleVoltar = () => {
    if (etapaAtual === 1) {
      setSelectedModel(null);
      setSelectedTags(null);
    } else {
      setEtapaAtual((prev) => Math.max(prev - 1, 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedModel) return;
      if (e.key === "ArrowRight") handleProxima();
      else if (e.key === "ArrowLeft") handleVoltar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModel, etapaAtual, file]); // 🔹 dependência correta

  if (docSelecionado) return null;
  if (tool === 1 || tool === 4 || tool === 5) return null;

  return (
    <div className="status-bar">
      {selectedModel ? (
        <div className="space-between">
          <div className="flex-col">
            <h4 style={{fontSize: "var(--font-size-xs"}}>Indicador de passos</h4>
            <div
              className="flex-row"
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <Icons.Selected
                size={15}
                style={{ marginRight: 10, color: "#597dff" }}
              />
              <h3 className="controle" style={{fontSize: "var(--font-size-sm"}}>
                {etapaAtual} de {ETAPAS.length}
              </h3>
            </div>
          </div>
          <div className="flex-row space-between" style={{width: "28%"}}>
            <button className="btn-primary" onClick={handleVoltar}>
              Voltar
            </button>
            {etapaAtual <= 2 && (
              <button className="btn-primary" onClick={handleProxima}>
                Próxima
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <button className="btn-primary" style={{ opacity: 0.5 }}>
            Salvar modificações
          </button>
        </div>
      )}
    </div>
  );
}

export default StatusBar;
