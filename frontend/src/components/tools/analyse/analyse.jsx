import AnalisarArquivos from "../../Analysis/analisa-arquivos";
import { ETAPAS } from "../../../constants/constants";

export function AnalyseDoc({
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
  closeAlert,
  setCloseAlert,
  user,
  isResponse,
  setIsResponse,
  alertSuccess,
  alertError,
  showAlert,
  docSelecionado,
  setDocSelecionado,
  setDocumentos,
  onVoltar,
  triggerShake,
  setTool,
  setTags,
  tags,
}) {

  const goToEtapa = (targetId) => {
    if (targetId === 3 && !file) {
      triggerShake();
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, ETAPAS.length)));
  };

  return (
    <>
      {/* Alertas globais */}
      {alertSuccess && <div className="alert success">{alertSuccess}</div>}
      {alertError && <div className="alert error">{alertError}</div>}

      <AnalisarArquivos
        openDocsVisible={openDocsVisible}
        setModelos={setModelos}
        modelos={modelos}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        etapas={etapas}
        etapaAtual={etapaAtual}
        setEtapaAtual={goToEtapa}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        file={file}
        setFile={setFile}
        erroArquivo={erroArquivo}
        onBlocked={triggerShake}
        tremer={tremer}
        setTremer={setTremer}
        closeAlert={closeAlert}
        setCloseAlert={setCloseAlert}
        setDocumentos={setDocumentos}
        user={user}
        docSelecionado={docSelecionado}
        setDocSelecionado={setDocSelecionado}
        onVoltar={onVoltar}
        setIsResponse={setIsResponse}
        isResponse={isResponse}
        isEtapaDisabled={isEtapaDisabled}
        handleClick={goToEtapa}
        showAlert={showAlert}
        setTool={setTool}
        setTags={setTags}
        tags={tags}
      />
    </>
  );
}

export default AnalyseDoc;
