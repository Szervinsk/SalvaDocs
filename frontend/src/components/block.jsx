import { useState } from "react";
import { Icons } from "../constants/icons";
import { ETAPAS, ALERTS } from "../constants/constants";
import axios from "axios";

import ActionBar from "./action-bar";
import DynamicsStaticts from "./dynstatistics";
import { AnalyseDoc } from "./analyse";
import StatusBar from "./status-bar";

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
          setTool={setTool}
        />

        {/* Middle Area */}
        <div className="middle-area">
          {tool === 1 ? (
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
          ) : (
            <DynamicsStaticts
              selectedModel={selectedModel}
              selectedTags={selectedTags}
              etapaAtual={etapaAtual}
              file={file}
              documentos={documentos}
            />
          )}
        </div>

        <StatusBar
          selectedModel={selectedModel}
          setEtapaAtual={setEtapaAtual}
          setSelectedModel={setSelectedModel}
          etapaAtual={etapaAtual}
          file={file}
          triggerShake={triggerShake}
        />
      </main>
    </>
  );
}

export default Block;
