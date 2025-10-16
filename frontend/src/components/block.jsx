import { useState, useEffect } from "react";
import { Icons } from "../constants/icons";
import { ETAPAS } from "../constants/constants";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

// Importação das Ferramentas (Componentes Filhos)
import AnalyseDoc from "./tools/analyse/analyse";
import Home from "./tools/home/home";
import EditModels from "./tools/models/edit-models";
import Configurations from "./tools/configurations/configurations";
import Account from "./tools/account/account";
import OpenDocs from "./openDocs/open-docs";
import ActionBar from "./bars/actionStatusBars/action-bar";
import StatusBar from "./bars/actionStatusBars/status-bar";
import ApiMonitoration from "./tools/dev/ApiMonitoration";
import MoreContent from "./more/moreContent";
import AboutPage from "./tools/aboutPage/AboutPage";

function Block({
  // Props recebidas do App.jsx
  pastas,
  modelos,
  documentos,
  onDataChange,
  setPastas,
  setModelos,
  setDocumentos,
  user,
  tool,
  setTool,
  docSelecionado,
  setDocSelecionado,
  selectedModel,
  setSelectedModel,
  darkMode,
  setDarkMode,
  showAlert,
  baseURL,
  setUser,
  onLogout,
  setPastasAbertas,
  pastasAbertas
}) {
  // Estados locais do Block, para gerenciar o fluxo interno
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [tremer, setTremer] = useState(false);
  const [more, setMore] = useState(false);
  const [visualizarPDF, setVisualizarPDF] = useState(true);

  // Limpa estados específicos da análise quando o usuário muda de ferramenta
  useEffect(() => {
    if (tool !== 2) {
      setSelectedModel(null);
      setSelectedTags([]);
      setFile(null);
      setEtapaAtual(1);
    }
  }, [tool, setSelectedModel]);

  // Busca a lista completa de tags uma vez, para usar nos componentes filhos
  useEffect(() => {
    axios.get(`${baseURL}/tags`)
      .then((res) => {
        setTags(res.data || [])
      })
      .catch(err => {
        console.error("Erro ao buscar todas as tags:", err);
        showAlert("error", "Não foi possível carregar as tags (block).");
      });
  }, [showAlert]);

  const triggerShake = () => {
    setTremer(true);
    setTimeout(() => setTremer(false), 4000);
    showAlert("warning", "Ação bloqueada: anexe um arquivo para prosseguir.");
  };

  const isEtapaDisabled = (id) => {
    if (id <= etapaAtual) return false;
    if (id === 3 && !file) return true;
    return false;
  };

  // Função que decide qual componente de ferramenta renderizar
  const handleSelectTool = (id) => {
    switch (id) {
      case 1:
        return (
          <Home
            user={user}
            setDocSelecionado={setDocSelecionado}
            documentos={documentos}
            pastas={pastas}
            modelos={modelos}
            setTool={setTool}
            setSelectedModel={setSelectedModel}
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
            tremer={tremer}
            setDocSelecionado={setDocSelecionado}
            triggerShake={triggerShake}
            isEtapaDisabled={isEtapaDisabled}
            showAlert={showAlert}
            user={user}
            setTool={setTool}
            tags={tags}
            setDocumentos={setDocumentos}
            pastas={pastas}
          />
        );
      case 3:
        return (
          <EditModels
            modelos={modelos}
            tags={tags}
            pastas={pastas}
            setModelos={setModelos}
            setTags={setTags}
            setPastas={setPastas}
            onDataChange={onDataChange}
            showAlert={showAlert}
            baseURL={baseURL}
          />
        );
      case 4:
        return (
          <Configurations
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setPastasAbertas={setPastasAbertas}
            pastasAbertas={pastasAbertas}
            visualizarPDF={visualizarPDF}
            setVisualizarPDF={setVisualizarPDF}
            showAlert={showAlert}
          />
        );
      case 5:
        return <Account user={user} onUserUpdate={setUser}
          onLogout={onLogout} showAlert={showAlert} baseURL={baseURL} />;
      case 6:
        return <ApiMonitoration modelos={modelos} tags={tags} pastas={pastas} documentos={documentos} baseURL={baseURL} />;
      case 7:
        return <AboutPage />;
      default:
        // Se nenhuma ferramenta for selecionada, volta para a Home
        return (
          <Home
            user={user}
            setDocSelecionado={setDocSelecionado}
            documentos={documentos}
            pastas={pastas}
            modelos={modelos}
            setTool={setTool}
            setSelectedModel={setSelectedModel}
          />
        );
    }
  };

  return (
    <main className="switch-area" style={{ borderTopLeftRadius: pastasAbertas ? "none" : "10px", borderBottomLeftRadius: pastasAbertas ? "none" : "10px" }}>
      {/* Caixa do more */}
      {more && <MoreContent tool={tool} setTool={setTool} setMore={setMore} />}

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
      />

      <div className="middle-area">
        <div className="main-content">
          {handleSelectTool(tool)}
        </div>

        <AnimatePresence>
          {docSelecionado && (
            <OpenDocs
              docSelecionado={docSelecionado}
              showAlert={showAlert}
              onClose={() => setDocSelecionado(null)}
              baseURL={baseURL}
              visualizarPDF={visualizarPDF}
              setVisualizarPDF={setVisualizarPDF}
            />
          )}
        </AnimatePresence>
      </div>

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