import { useEffect } from "react";
import { Icons } from "../../../constants/icons";
import { ETAPAS } from "../../../constants/constants";

function StatusBar({
  selectedModel,
  setSelectedModel,
  etapaAtual,
  setEtapaAtual,
  file,
  triggerShake,
  docSelecionado,
  setSelectedTags,
  tool,
}) {

  const handleProxima = () => {
    if (etapaAtual === 2 && !file) {
      triggerShake();
    } else {
      setEtapaAtual((prev) => Math.min(prev + 1, ETAPAS.length));
    }
  };

  const handleVoltar = () => {
    if (etapaAtual === 1) {
      setSelectedModel(null);
      setSelectedTags([]); // Use um array vazio para consistência
    } else {
      setEtapaAtual((prev) => Math.max(prev - 1, 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedModel || docSelecionado) return;
      if (e.key === "ArrowRight") handleProxima();
      else if (e.key === "ArrowLeft") handleVoltar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModel, etapaAtual, file, docSelecionado]); // Adicionado docSelecionado

  // Não renderiza a barra em certas condições
  if (docSelecionado || ![2, 3].includes(tool)) {
    return null;
  }

  return (
    <div className="status-bar">
      <div className="status-bar__info">
        {selectedModel && (
          <div className="info-block">
            <h4 className="info-block__title">Indicador de Passos</h4>
            <div className="info-block__content">
              <Icons.Selected size={16} className="icon--accent" />
              <h3 className="info-block__value">{etapaAtual} de {ETAPAS.length}</h3>
            </div>
          </div>
        )}
      </div>

      <div className="status-bar__actions">
        {selectedModel && (
          <>
            <button className="btn-secondary" onClick={handleVoltar}>
              <Icons.ArrowLeft size={16} />
              Voltar
            </button>
            {etapaAtual < ETAPAS.length && (
              <button className="btn-primary" onClick={handleProxima}>
                Próxima
                <Icons.ArrowRight size={16} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StatusBar;