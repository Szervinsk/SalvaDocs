import AnalisarArquivos from "../../Analysis/AnalysisPage";
import { ETAPAS } from "../../../constants/constants";
import Alerts from "../../alerts/alerts";

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
  files,       // <--- ALTERADO DE 'file' PARA 'files'
  setFiles,    // <--- ALTERADO DE 'setFile' PARA 'setFiles'
  erroArquivo,
  isEtapaDisabled,
  tremer,
  setTremer,
  closeAlert,
  setCloseAlert,
  user,
  alertSuccess,
  alertError,
  showAlert,
  docSelecionado,
  setDocSelecionado,
  setDocumentos,
  documentos,
  onVoltar,
  triggerShake,
  setTool,
  setTags,
  tags,
  baseURL,
  pastas,
  handleScrollTo,
}) {

  const goToEtapa = (targetId) => {
    // <--- ALTERADO: Verifica se o array existe e se tem itens
    if (targetId === 3 && (!files || files.length === 0)) {
      triggerShake();
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, ETAPAS.length)));
  };

  return (
    <>
      {/* Alertas globais */}
      {alertSuccess && <Alerts type={3} />}
      {alertError && <Alerts type={4} />}

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
        files={files}       // <--- ALTERADO: Passando o array para AnalysisPage
        setFiles={setFiles} // <--- ALTERADO: Passando a função para AnalysisPage
        erroArquivo={erroArquivo}
        onBlocked={triggerShake}
        tremer={tremer}
        setTremer={setTremer}
        closeAlert={closeAlert}
        setCloseAlert={setCloseAlert}
        setDocumentos={setDocumentos}
        documentos={documentos}
        user={user}
        docSelecionado={docSelecionado}
        setDocSelecionado={setDocSelecionado}
        onVoltar={onVoltar}
        isEtapaDisabled={isEtapaDisabled}
        handleClick={goToEtapa}
        showAlert={showAlert}
        setTool={setTool}
        setTags={setTags}
        baseURL={baseURL}
        tags={tags}
        pastas={pastas}
        handleScrollTo={handleScrollTo}
      />
    </>
  );
}

export default AnalyseDoc;