import { Icons } from "../constants/icons";
import AnalisarArquivos from "../components/analisa-arquivos";
import axios from "axios";
import { ETAPAS } from "../constants/constants";

export function AnalyseDoc({
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
  more,
  setMore,
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
}) {
  const goToEtapa = (targetId) => {
    if (targetId === 3 && !file) {
      triggerShake();
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, ETAPAS.length)));
  };

  // Visualizar em uma nova aba
  const handleVisualizar = () => {
    if (docSelecionado?.path) {
      window.open(`//${docSelecionado.path}`, "_blank");
    } else {
      alert("Arquivo não encontrado!");
    }
  };

  // Baixar arquivo
  const handleDownload = () => {
    if (docSelecionado?.path) {
      const link = document.createElement("a");
      link.href = `http://localhost:5000/api/files${docSelecionado.path}`;
      link.download = docSelecionado.name || "documento.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Arquivo não encontrado!");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja apagar este documento?"))
      return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/delete/${docSelecionado.id}`
      );

      setDocumentos((prev) => prev.filter((d) => d.id !== docSelecionado.id));
      setDocSelecionado(null);
      setSelectedModel(null);
      setIsResponse(false);
      setEtapaAtual(1);

      showAlert("success", "Documento apagado com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar documento:", error);
      showAlert("error", "Erro ao apagar documento!");
    }
  };

  return (
    <>
      {/* Alertas globais */}
      {alertSuccess && <div className="alert success">{alertSuccess}</div>}
      {alertError && <div className="alert error">{alertError}</div>}

      {/* MoreOptions */}
      {more && docSelecionado && (
        <div className="moreOptions">
          <div className="moreOptions-bar">
            <h3>Mais opções</h3>
            <Icons.Close
              size={20}
              className="icons"
              onClick={() => setMore(!more)}
            />
          </div>

          <ul style={{ padding: 0 }}>
            <li className="flex-left-right" style={{ marginBottom: "10px" }}>
              <button className="action-big-btns" onClick={handleVisualizar}>
                <Icons.Pdf_file size={20} className="icons" />
                <h3>Enviar arquivo</h3>
              </button>
            </li>

            <li className="flex-left-right" style={{ marginBottom: "10px" }}>
              <button className="action-big-btns" onClick={handleDownload}>
                <Icons.Download size={20} className="icons" />
                <h3>Baixar arquivo</h3>
              </button>
            </li>

            <li className="flex-left-right">
              <button className="action-big-btns" onClick={handleDelete}>
                <Icons.Delete size={20} className="delete" />
                <h3>Deletar arquivo</h3>
              </button>
            </li>
          </ul>
        </div>
      )}

      {more && !docSelecionado && (
        <div className="moreOptions">
          <div className="moreOptions-bar">
            <h3>Mais opções</h3>
            <Icons.Close
              size={20}
              className="icons"
              onClick={() => setMore(!more)}
            />
          </div>

          <ul style={{ padding: 0 }}>
            <li className="flex-left-right" style={{ marginBottom: "10px" }}>
              <button className="action-big-btns">
                <Icons.Question size={20} className="icons" />
                <h3>Dúvidas sobre</h3>
              </button>
            </li>

            <li className="flex-left-right">
              <button className="action-big-btns">
                <Icons.Search size={20} className="delete" />
                <h3>Ajuda eu</h3>
              </button>
            </li>
          </ul>
        </div>
      )}

      <AnalisarArquivos
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
        docSelecionado={docSelecionado}
        setDocSelecionado={setDocSelecionado}
        onVoltar={onVoltar}
        setIsResponse={setIsResponse}
        isResponse={isResponse}
        isEtapaDisabled={isEtapaDisabled}
        handleClick={goToEtapa}
      />
    </>
  );
}

export default AnalyseDoc;
