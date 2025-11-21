import { useEffect, useState, useMemo, useRef } from "react";
import { Icons } from "../constants/icons";
import { ETAPAS } from "../constants/constants";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

// Importação das Ferramentas (Componentes Filhos)
import AnalyseDoc from "./tools/analyse/analyse";
import Home from "./tools/home/home";
import EditManager from "./tools/models/edit-manager";
import Configurations from "./tools/configurations/configurations";
import Account from "./tools/account/account";
import Routes from "./tools/routes/routes";
import OpenDocs from "./openDocs/open-docs";
import ActionBar from "./bars/actionStatusBars/action-bar";
import StatusBar from "./bars/actionStatusBars/status-bar";
import ApiMonitoration from "./tools/dev/ApiMonitoration";
import MoreContent from "./more/moreContent";
import AboutPage from "./tools/aboutPage/AboutPage";

function Block({
  // Props de Dados e Estado do App.jsx
  pastas,
  modelos,
  documentos,
  setDocumentos,
  onDataChange,
  dataView, // Recebe o estado da visão (false=Docs, true=Dashboard)
  setDataView, // Recebe o setter
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
  setUser,
  onLogout,
  setPastasAbertas,
  pastasAbertas,
  onToggleFavorite,
  favoriteModelIds,
  loading,

  // Props de Refs para rolagem
  tagsRef,
  modelosRef,
  pastasRef,
  dashboardRef,
  handleScrollTo
}) {
  // Estados locais do Block (para o fluxo de Análise)
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [tremer, setTremer] = useState(false);
  const [more, setMore] = useState(false);
  const [visualizarPDF, setVisualizarPDF] = useState(true);

  // Limpa estados específicos da análise
  useEffect(() => {
    if (tool !== 1) { // Tool 1 agora é "Analisar"
      setSelectedModel(null);
      setSelectedTags([]);
      setFile(null);
      setEtapaAtual(1);
    }
  }, [tool, setSelectedModel]);

  // Busca todas as tags
  useEffect(() => {
    axios.get(`/tags`)
      .then((res) => {
        setTags(res.data || [])
      })
      .catch(err => {
        console.error("Erro ao buscar todas as tags:", err);
        showAlert("error", "Não foi possível carregar as tags.");
      });
  }, [showAlert]);

  // Função para acionar o tremor e alerta de bloqueio
  const triggerShake = () => {
    setTremer(true);
    setTimeout(() => setTremer(false), 500);
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
      case 1: // Analisar
        return (
          <AnalyseDoc
            modelos={modelos}
            etapas={ETAPAS}
            tags={tags}
            pastas={pastas}
            user={user}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            etapaAtual={etapaAtual}
            setEtapaAtual={setEtapaAtual}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            file={file}
            setFile={setFile}
            tremer={tremer}
            setDocSelecionado={setDocSelecionado}
            documentos={documentos}
            setDocumentos={setDocumentos}
            setTool={setTool}
            handleScrollTo={handleScrollTo}
            erroArquivo={false} // Resetar erro?
            isEtapaDisabled={isEtapaDisabled}
            onBlocked={triggerShake}
            showAlert={showAlert}
            onToggleFavorite={onToggleFavorite}
            favoriteModelIds={favoriteModelIds}
          />
        );
      case 2: // Relatório (Home)
        return (
          <Home
            user={user}
            documentos={documentos}
            pastas={pastas}
            tags={tags}
            setArea={handleScrollTo} // Para os StatCards
            modelos={modelos}
            loading={loading}
            setDocSelecionado={setDocSelecionado}
            setTool={setTool}
            dataView={dataView}
            setDataView={setDataView}
          />
        );
      case 3: // Gerenciar (EditModels)
      case 30:
      case 31:
      case 32:
        return (
          <EditManager
            modelos={modelos}
            tags={tags}
            pastas={pastas}
            documentos={documentos}
            onDataChange={onDataChange}
            showAlert={showAlert}
            handleScrollTo={handleScrollTo}
            modelosRef={modelosRef}
            tagsRef={tagsRef}
            pastasRef={pastasRef}
            dashboardRef={dashboardRef} // Passa a ref do dashboard
            initialSection={id} // Passa o ID para a rolagem inicial
          />
        );
      case 4: // Rotas (Bot)
      case 41:
      case 42:
        return <Routes user={user} showAlert={showAlert} onDataChange={onDataChange} />;
      case 5: // Monitoramento APIs
        return <ApiMonitoration />;
      case 6: // Configurações
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
      case 7: // Sobre o projeto
        return <AboutPage />;
      case 8: // Conta
        return (
          <Account
            user={user}
            onUserUpdate={setUser}
            onLogout={onLogout}
            showAlert={showAlert}
          />
        );
      default:
        // Se 'tool' for null ou inválido, volta para Analisar (Tool 1)
        setTool(1);
        return null;
    }
  };

  return (
    <main className="switch-area" style={{ borderTopLeftRadius: pastasAbertas ? "0px" : "10px", borderBottomLeftRadius: pastasAbertas ? "0px" : "10px" }}>
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
              visualizarPDF={visualizarPDF}
              onDataChange={onDataChange}
              baseURL={axios.defaults.baseURL.replace("/api", "")}
            />
          )}
        </AnimatePresence>
      </div>

      {(tool === 1 && selectedModel) && (
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