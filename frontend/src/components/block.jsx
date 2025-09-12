import { useState, useEffect } from "react";
import { Icons } from "../constants/icons";
import { ETAPAS, TAGS } from "../constants/constants";
import ActionBar from "./bars/action-bar";
import axios from "axios";

// tools
import AnalyseDoc from "./tools/analyse";
import Home from "./tools/home";
import EditModels from "./tools/edit-models";
import Configurations from "./tools/configurations";
import Account from "./tools/account";
import OpenDocs from "./open-docs";

import More from "./more";
import StatusBar from "./bars/status-bar";

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
  onVoltar,
  user,
  barraLateral,
  setBarraLateral,
}) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [erroArquivo, setErroArquivo] = useState(false);
  const [tremer, setTremer] = useState(false);
  const [closeAlert, setCloseAlert] = useState(false);
  const [more, setMore] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tags, setTags] = useState([]);

  // novo state para abrir/fechar OpenDocs
  const [openDocsVisible, setOpenDocsVisible] = useState(false);

  useEffect(() => {
    if (docSelecionado) {
      setOpenDocsVisible(true);
    }
  }, [docSelecionado]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/tags/")
      // endpoint retorna modelo com suas tags
      .then((res) => {
        const tagsDoModelo = res.data || [];
        setTags(tagsDoModelo);
      });
  }, []);

  const [lastTool, setLastTool] = useState(null);

  // função pra alternar expansão
  const toggleExpandDocs = () => {
    if (tool === 6) {
      // volta ao tool antigo
      if (lastTool) setTool(lastTool);
    } else {
      // guarda o tool atual e expande
      setLastTool(tool);
      setTool(6);
    }
  };


  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    if (tool === 2) {
      setEtapaAtual(1);
    }
  }, [tool]);

  const triggerShake = () => {
    setErroArquivo(true);
    setTremer(true);
    setTimeout(() => setTremer(false), 500);
    setTimeout(() => setErroArquivo(false), 500);
    showAlert("warning", "Nenhum arquivo foi anexado!");
  };

  const isEtapaDisabled = (id) => {
    if (id <= etapaAtual) return false;
    if (id === 2) return false;
    if (id === 3) return !file;
    return false;
  };

  const handleSelectTool = (id) => {
    switch (id) {
      case 1:
        return (
          <Home
            documentos={documentos}
            modelos={modelos}
            user={user}
            setDocSelecionado={setDocSelecionado}
            docSelecionado={docSelecionado}
            onVoltar={onVoltar}
            setDocumentos={setDocumentos}
            setSelectedModel={setSelectedModel}
            setEtapaAtual={setEtapaAtual}
            showAlert={showAlert}
            setTool={setTool}
            setBarraLateral={setBarraLateral}
          />
        );

      case 2:
        return (
          <AnalyseDoc
            openDocsVisible={openDocsVisible}
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
            setErroArquivo={setErroArquivo}
            tremer={tremer}
            setTremer={setTremer}
            closeAlert={closeAlert}
            setCloseAlert={setCloseAlert}
            more={more}
            setMore={setMore}
            isResponse={isResponse}
            setIsResponse={setIsResponse}
            documentos={documentos}
            setDocumentos={setDocumentos}
            docSelecionado={docSelecionado}
            setDocSelecionado={setDocSelecionado}
            onVoltar={onVoltar}
            triggerShake={triggerShake}
            isEtapaDisabled={isEtapaDisabled}
            showAlert={showAlert}
            user={user}
            setTool={setTool}
            setTags={setTags}
            tags={tags}
          />
        );

      case 3:
        return (
          <EditModels
            modelos={modelos}
            tags={tags}
          />
        );

      case 4:
        return <Configurations />;

      case 5:
        return <Account />;

      case 6:
        return null;

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

      {more && (
        <More more={more} docSelecionado={docSelecionado} setMore={setMore} />
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
          setOpenDocsVisible={setOpenDocsVisible} // passa controle pro actionbar se quiser abrir
        />

        {/* Middle Area */}
        <div
          className={`middle-area 
    ${openDocsVisible ? "with-open-docs" : ""} 
    ${tool === 6 ? "expanded" : ""}`}
        >
          <div
            className="main-content"
            style={{ opacity: openDocsVisible && tool !== 6 ? 0.5 : 1 }}
          >
            {openDocsVisible ? (<div className="blur"></div>) : null}
            {handleSelectTool(tool)}
          </div>

          <div className="open-docs-wrapper">
            {openDocsVisible && docSelecionado && (
              <OpenDocs
                docSelecionado={docSelecionado}
                tags={docSelecionado.tags}
                setDocSelecionado={setDocSelecionado}
                setSelectedModel={setSelectedModel}
                setEtapaAtual={setEtapaAtual}
                setDocumentos={setDocumentos}
                setIsResponse={setIsResponse}
                showAlert={showAlert}
                setTool={setTool}
                onClose={() => {
                  setOpenDocsVisible(false);
                  setDocSelecionado(null);
                  setIsResponse(false);
                  setEtapaAtual(1);
                }}
                onToggleExpand={toggleExpandDocs}
                isExpanded={tool === 6}
              />
            )}
          </div>
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
