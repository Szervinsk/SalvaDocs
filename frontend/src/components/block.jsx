import { useState } from "react";
import { Icons } from "../constants/icons";
import { ETAPAS } from "../constants/constants";
import ActionBar from "./bars/action-bar";

// tools
import AnalyseDoc from "./tools/analyse";
import Home from "./tools/home";
import EditModels from "./tools/edit-models";
import Configurations from "./tools/configurations";
import Account from "./tools/account";
import OpenDocs from "./open-docs";

import StatusBar from "./bars/status-bar";

function Block({
  modelos,
  selectedModel,
  setSelectedModel,
  documentos,
  setDocumentos,
  docSelecionado,
  setDocSelecionado,
  tool,
  setTool,
  onVoltar,
}) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [erroArquivo, setErroArquivo] = useState(false);
  const [tremer, setTremer] = useState(false);
  const [closeAlert, setCloseAlert] = useState(false);
  const [more, setMore] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error' | 'warning', message: string }
  const [searchQuery, setSearchQuery] = useState("");

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000); // some após 3s
  };

  const triggerShake = () => {
    setErroArquivo(true);
    setTremer(true);
    setTimeout(() => setTremer(false), 500);
    setTimeout(() => setErroArquivo(false), 500);
    showAlert("warning", "Nenhum arquivo foi anexado!");
  };

  const isEtapaDisabled = (id) => {
    if (id <= etapaAtual) return false; // voltar ou clicar na atual
    if (id === 2) return false; // 1 → 2 sempre permitido
    if (id === 3) return !file; // 1/2 → 3 só com anexo
    return false;
  };

  const handleSelectTool = (id) => {
    switch (id) {
      case 1:
        return <Home documentos={documentos} />;
      case 2:
        return (
          <AnalyseDoc
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
            setErroArquivo={setErroArquivo}
            tremer={tremer}
            setTremer={setTremer}
            closeAlert={closeAlert}
            setCloseAlert={setCloseAlert}
            more={more}
            setMore={setMore}
            isResponse={isResponse}
            setIsResponse={setIsResponse}
            documentos={documentos} // <- passa para o filho
            setDocumentos={setDocumentos}
            docSelecionado={docSelecionado}
            setDocSelecionado={setDocSelecionado}
            onVoltar={onVoltar}
            triggerShake={triggerShake}
            isEtapaDisabled={isEtapaDisabled}
            showAlert={showAlert}
          />
        );
      case 3:
        return (
          <EditModels
            modelos={modelos}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        );
      case 4:
        return <Configurations />;
      case 5:
        return <Account />;
      case 6:
        return (
          <OpenDocs
            onClose={() => (
              setIsResponse(false), setDocSelecionado(null), setEtapaAtual(1)
            )}
            docSelecionado={docSelecionado}
            setDocSelecionado={setDocSelecionado}
            tags={docSelecionado?.tags ?? []}
            onVoltar={onVoltar}
            setDocumentos={setDocumentos}
            setSelectedModel={setSelectedModel}
            showAlert={showAlert}
            setIsResponse={setIsResponse}
          />
        );
      default:
        setTool(1);
    }
  };

  return (
    <>
      {alert && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
          <Icons.Close size={20} onClick={() => setAlert(null)} />
        </div>
      )}

      <main className="switch-area">
        {/* Action Bar */}
        <ActionBar
          docSelecionado={docSelecionado}
          selectedModel={selectedModel}
          selectedTags={selectedTags}
          etapaAtual={etapaAtual}
          file={file}
          setMore={setMore}
          more={more}
          tool={tool}
          setTool={setTool}
          setDocSelecionado={setDocSelecionado}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Middle Area */}
        <div className="middle-area">
          <>{handleSelectTool(tool)}</>
        </div>

        <StatusBar
          selectedModel={selectedModel}
          setEtapaAtual={setEtapaAtual}
          setSelectedModel={setSelectedModel}
          etapaAtual={etapaAtual}
          file={file}
          triggerShake={triggerShake}
          docSelecionado={docSelecionado}
          setSelectedTags={setSelectedTags}
          tool={tool}
        />
      </main>
    </>
  );
}

export default Block;
