import { useState, useEffect } from "react";
import { Icons } from "../constants/icons";
import { ETAPAS } from "../constants/constants";
import ActionBar from "./bars/actionStatusBars/action-bar";
import axios from "axios";
import { AnimatePresence } from "framer-motion";

// Tools
import AnalyseDoc from "./tools/analyse/analyse";
import Home from "./tools/home/home";
import EditModels from "./tools/models/edit-models";
import Configurations from "./tools/configurations/configurations";
import Account from "./tools/account/account";
import OpenDocs from "./openDocs/open-docs";
import StatusBar from "./bars/actionStatusBars/status-bar";

function Block({
  setModelos,
  modelos,
  selectedModel,
  setSelectedModel,
  documentos,
  setDocumentos,
  docSelecionado,
  setDocSelecionado,
  tool,
  setTool,
  user,
  pastas,
  setDarkMode,
  darkMode,
  showAlert, // Recebendo showAlert para passar para OpenDocs
}) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [erroArquivo, setErroArquivo] = useState(false);
  const [tremer, setTremer] = useState(false);
  const [more, setMore] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [tags, setTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Limpa o estado da análise quando o 'tool' principal muda
  useEffect(() => {
    if (tool !== 2) {
      setSelectedModel(null);
      setSelectedTags([]);
      setFile(null);
      setEtapaAtual(1);
    }
  }, [tool, setSelectedModel, setSelectedTags, setFile, setEtapaAtual]);

  // Busca todas as tags disponíveis ao montar o componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/tags/")
      .then((res) => {
        setTags(res.data || []);
      })
      .catch(err => console.error("Erro ao buscar todas as tags:", err));
  }, []);

  const toggleExpandDocs = () => setIsExpanded(prev => !prev);

  const triggerShake = () => {
    setErroArquivo(true);
    setTremer(true);
    setTimeout(() => setTremer(false), 500);
    setTimeout(() => setErroArquivo(false), 500);
    showAlert("warning", "Nenhum arquivo foi anexado!");
  };

  const isEtapaDisabled = (id) => {
    if (id <= etapaAtual) return false;
    if (id === 3 && !file) return true;
    return false;
  };

  const handleSelectTool = (id) => {
    switch (id) {
      case 1:
        return (
          <Home
            documentos={documentos}
            user={user}
            setDocSelecionado={setDocSelecionado}
            docSelecionado={docSelecionado}
            setTool={setTool}
            setSelectedModel={setSelectedModel}
            setEtapaAtual={setEtapaAtual}
          />
        );
      case 2:
        return (
          <AnalyseDoc
            setModelos={setModelos}
            modelos={modelos}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            etapas={ETAPAS}
            etapaAtual={etapaAtual}
            setEtapaAtual={setEtapaAtual}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            file={file}
            setFile={setFile}
            erroArquivo={erroArquivo}
            tremer={tremer}
            setIsResponse={setIsResponse}
            setDocSelecionado={setDocSelecionado}
            triggerShake={triggerShake}
            isEtapaDisabled={isEtapaDisabled}
            showAlert={showAlert}
            user={user}
            setTool={setTool}
            tags={tags}
            setTags={setTags}
            setDocumentos={setDocumentos}
            pastas={pastas}
          />
        );
      case 3:
        return <EditModels modelos={modelos} tags={tags} pastas={pastas} showAlert={showAlert}/>;
      case 4:
        return <Configurations setDarkMode={setDarkMode} darkMode={darkMode} />;
      case 5:
        return <Account user={user} />;
      default:
        // Se nenhuma ferramenta estiver selecionada (tool === null), renderiza Home
        if (tool === null) {
          return (
            <Home
              documentos={documentos}
              user={user}
              setDocSelecionado={setDocSelecionado}
              docSelecionado={docSelecionado}
              setTool={setTool}
              setSelectedModel={setSelectedModel}
              setEtapaAtual={setEtapaAtual}
            />
          );
        }
        return null;
    }
  };

  return (
    <main className="switch-area">
      <ActionBar
        docSelecionado={docSelecionado}
        selectedModel={selectedModel}
        setDocSelecionado={setDocSelecionado}
        selectedTags={selectedTags}
        etapaAtual={etapaAtual}
        file={file}
        setMore={setMore}
        more={more}
        tool={tool}
        setTool={setTool}
        pastas={pastas}
      />

      <div className="middle-area">
        {/* O conteúdo principal (Home, AnalyseDoc, etc.) é renderizado aqui */}
        <div className="main-content">
          {handleSelectTool(tool)}
        </div>

        {/* O OpenDocs (modal) é renderizado por cima quando um doc está selecionado */}
        <AnimatePresence>
          {docSelecionado && (
            <OpenDocs
              docSelecionado={docSelecionado}
              setDocumentos={setDocumentos}
              showAlert={showAlert}
              onClose={() => setDocSelecionado(null)}
              onToggleExpand={toggleExpandDocs}
              isExpanded={isExpanded}
            />
          )}
        </AnimatePresence>
      </div>

      {/* A StatusBar aparece condicionalmente na parte inferior */}
      {(tool === 2 && selectedModel) && (
        <StatusBar
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          etapaAtual={etapaAtual}
          setEtapaAtual={setEtapaAtual}
          file={file}
          triggerShake={triggerShake}
          setSelectedTags={setSelectedTags}
        />
      )}
    </main>
  );
}

export default Block;