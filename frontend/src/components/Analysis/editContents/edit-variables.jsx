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
  files,       
  modelos,
  setFiles,    
  erroArquivo,
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
  const [limitador, setLimitador] = useState(false);
  const [filesConfig, setFilesConfig] = useState([]);

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
        showAlert={showAlert}
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
        files={files}
        setFiles={setFiles}
        pastas={pastas}
        tags={tags}
        modelos={modelos}
        selectedTags={selectedTags}
        erroArquivo={erroArquivo}
        showAlert={showAlert}
        limitador={limitador}
        setLimitador={setLimitador}
        
        // NOVA PROP: Recebe as configurações dos arquivos do filho
        onConfigsChange={setFilesConfig}
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
        files={files} 
        tags={tags}
        onClose={() => {
          setDocSelecionado(null);
          setEtapaAtual(1);
        }}
        user={user}
        setDocSelecionado={setDocSelecionado}
        setDocumentos={setDocumentos}
        showAlert={showAlert}
        selectedModel={selectedModel}
        setEtapaAtual={setEtapaAtual}
        setTool={setTool}
        
        filesConfig={filesConfig}
      />
    );
  }

  return null;
}

export default EditVariables;