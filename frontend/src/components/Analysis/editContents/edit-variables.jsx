import { useState, useEffect } from "react";
import EditTags from "./steps/edit-tags";
import EditExit from "./steps/edit-exit";
import EditAnalise from "./steps/edit-analysis";
import "../../tools/analyse/analysis.css";

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
  setEtapaAtual,
  showAlert,
  setDocumentos,
  user,
  tags,
  setTags,
  setTool,
  pastas,
}) {
  const [sendFiles, setSendFiles] = useState(false);
  const [alterName, setAlterName] = useState(false);
  const [limitador, setLimitador] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

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
        setTags={setTags}
        tags={tags}
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
        pastas={pastas}
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
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
      />
    );
  }
  // --- ETAPA 3: EditAnalise ---
  else if (etapaAtual === 3) {
    return (
      <EditAnalise
        etapas={etapas}
        etapaAtual={etapaAtual}
        selectedTags={selectedTags}
        file={file}
        tags={tags}
        onClose={() => {
          setIsResponse(false);
          setDocSelecionado(null);
          setEtapaAtual(1);
        }}
        user={user}
        setDocSelecionado={setDocSelecionado}
        setIsResponse={setIsResponse}
        setDocumentos={setDocumentos}
        showAlert={showAlert}
        selectedModel={selectedModel}
        setEtapaAtual={setEtapaAtual}
        fileName={fileName}
        setTool={setTool}
        selectedFolder={selectedFolder}
      />
    );
  }

  return null;
}

export default EditVariables;
