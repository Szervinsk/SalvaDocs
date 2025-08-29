import { useState, useEffect } from "react";
import EditTags from "./Analysis/edit-tags";
import EditExit from "./Analysis/edit-exit";
import EditAnalise from "./Analysis/edit-analysis";
import "../styles/analysis.css";

function EditVariables({
  etapas,
  etapaAtual,
  selectedModel,
  onClose,
  selectedTags,
  setSelectedTags,
  file,
  setFile,
  erroArquivo,
  setIsResponse,
  setDocSelecionado,
  setDocumentos,
  tags,
}) {
  const [moreTags, setMoreTags] = useState(false);
  const [sendFiles, setSendFiles] = useState(false);
  const [alterName, setAlterName] = useState(false);
  const [limitador, setLimitador] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- ETAPA 1: EditTags ---
  if (etapaAtual === 1) {
    return (
      <EditTags
        etapas={etapas}
        etapaAtual={etapaAtual}
        onClose={onClose}
        selectedModel={selectedModel}
        selectedTags={selectedTags || []}
        setSelectedTags={setSelectedTags}
      />
    );
  }
  // --- ETAPA 2: EditExit ---
  else if (etapaAtual === 2) {
    return (
      <EditExit
        etapas={etapas}
        etapaAtual={etapaAtual}
        selectedModel={selectedModel}
        onClose={onClose}
        file={file}
        setFile={setFile}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        sendFiles={sendFiles}
        setSendFiles={setSendFiles}
        erroArquivo={erroArquivo}
        setAlterName={setAlterName}
        alterName={alterName}
        setFileName={setFileName}
        limitador={limitador}
        setLimitador={setLimitador}
      />
    );
  }
  // --- ETAPA 3: EditAnalise ---
  else if (etapaAtual === 3) {
    return (
      <EditAnalise
        etapas={etapas}
        etapaAtual={etapaAtual}
        onClose={onClose}
        selectedTags={selectedTags}
        file={file}
        tags={tags}
        setIsResponse={setIsResponse}
        setDocSelecionado={setDocSelecionado}
        setDocumentos={setDocumentos}
        selectedModel={selectedModel}
        fileName={fileName}
      />
    );
  }

  return null;
}

export default EditVariables;
