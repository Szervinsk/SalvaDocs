import { useEffect, useState } from "react";
import { Icons } from "../../constants/icons";
import axios from "axios";

import EditVariables from "./editContents/edit-variables";
import EditEtapas from "./editContents/edit-etapas";

// --- Sub-componente para a tela de seleção de modelo ---
const ModelSelectionScreen = ({ modelos, openDocsVisible, handleModelText, setText, defaultMessage, handleModelClick, text }) => (
  <div className="model-selection-screen">
    <Icons.Search size={40} />
    <h2>Analisador de Arquivos</h2>
    <h3>Selecione abaixo o modelo de captura de dados desejado.</h3>

    <div className={`model-list ${openDocsVisible ? "is-compact" : ""}`}>
      {modelos.map((model) => (
        <div
          key={model.id}
          className="model-card"
          onMouseEnter={() => handleModelText(model)}
          onMouseLeave={() => setText(defaultMessage)}
          onClick={() => handleModelClick(model)}
        >
          <Icons.ScannerDocument size={24} />
          <h4>{model.name}</h4>
        </div>
      ))}
    </div>

    <div className="model-description-text">
      <Icons.Lamp size={20} />
      <p>{text}</p>
    </div>
  </div>
);


// --- Componente Principal ---
function AnalysisPage({
  openDocsVisible,
  setModelos,
  modelos,
  selectedModel,
  setSelectedModel,
  etapas,
  etapaAtual,
  setEtapaAtual,
  selectedTags,
  setSelectedTags,
  file,
  setFile,
  erroArquivo,
  isEtapaDisabled,
  tremer,
  setTremer,
  user,
  showAlert,
  setIsResponse,
  setDocSelecionado,
  setDocumentos,
  onBlocked,
  setTool,
  tags,
  setTags,
  pastas,
}) {
  const handleCloseModal = () => {
    setSelectedModel(null);
    setSelectedTags([]);
    setEtapaAtual(1);
  };

  const goToEtapa = (targetId) => {
    if (targetId === 3 && !file) {
      onBlocked();
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, etapas.length)));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/modelos/")
      .then((res) => setModelos(res.data))
      .catch((err) => console.error("Erro ao buscar modelos:", err));
  }, [setModelos]);

  const [text, setText] = useState("Use um dos modelos para iniciar a análise automatizada.");
  const defaultMessage = "Use um dos modelos para iniciar a análise automatizada.";
  const handleModelText = (model) => setText(`${model.description}`);

  const handleModelClick = async (model) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/modelos/${model.id}`);
      const tagsDoModelo = response.data.tagsBase || [];

      const idsDasTagsDoModelo = tagsDoModelo.map(tag => tag.id);
      setSelectedTags(idsDasTagsDoModelo);

      setSelectedModel(model);

    } catch (error) {
      console.error("Erro ao buscar as tags do modelo:", error);
    }
  };

  return (
    selectedModel ? (
      <div className="analysis-editor-screen">
        <div className="analysis-editor__main-content">
          <EditVariables
            etapas={etapas}
            etapaAtual={etapaAtual}
            setEtapaAtual={goToEtapa}
            selectedModel={selectedModel}
            onClose={handleCloseModal}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            file={file}
            setFile={setFile}
            erroArquivo={erroArquivo}
            showAlert={showAlert}
            setIsResponse={setIsResponse}
            setDocSelecionado={setDocSelecionado}
            tags={tags}
            setTags={setTags}
            setDocumentos={setDocumentos}
            setTool={setTool}
            user={user}
            pastas={pastas}
          />
        </div>
        <div className="analysis-editor__sidebar">
          <EditEtapas
            etapas={etapas}
            etapaAtual={etapaAtual}
            setEtapaAtual={goToEtapa}
            tremer={tremer}
            showAlert={showAlert}
            setTremer={setTremer}
            handleClick={goToEtapa}
            isEtapaDisabled={isEtapaDisabled}
            file={file}
          />
        </div>
      </div>
    ) : (
      <ModelSelectionScreen
        modelos={modelos}
        openDocsVisible={openDocsVisible}
        handleModelText={handleModelText}
        setText={setText}
        defaultMessage={defaultMessage}
        handleModelClick={handleModelClick}
        text={text}
      />
    )
  );
}

export default AnalysisPage;