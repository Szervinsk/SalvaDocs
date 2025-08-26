import { useState, useEffect } from "react";
import { Icons } from "../constants/icons";
import { ETAPAS } from "../constants/constants";
import AnalisarArquivos from "./analisa-arquivos";
import axios from "axios";

function Block({
  modelos,
  selectedModel,
  setSelectedModel,
  setDocumentos,
  docSelecionado,
  setDocSelecionado,
  onVoltar,
}) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [anexou, setAnexou] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [erroArquivo, setErroArquivo] = useState(false);
  const [tremer, setTremer] = useState(false);
  const [closeAlert, setCloseAlert] = useState(false);
  const [more, setMore] = useState(false);
  const [isResponse, setIsResponse] = useState(false);

  const [alertSuccess, setAlertSuccess] = useState(null);
  const [alertError, setAlertError] = useState(null);

  const triggerShake = () => {
    setErroArquivo(true);
    setTremer(true);
    setTimeout(() => setTremer(false), 500);
    setTimeout(() => setErroArquivo(false), 500);
  };

  const goToEtapa = (targetId) => {
    if (etapaAtual === 2 && targetId > etapaAtual && !anexou) {
      triggerShake();
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, ETAPAS.length)));
  };

  const handleProxima = () => {
    if (etapaAtual === 2 && !anexou) {
      triggerShake();
    } else {
      setEtapaAtual((prev) => Math.min(prev + 1, ETAPAS.length));
    }
  };

  const handleVoltar = () => {
    if (etapaAtual === 1) setSelectedModel(null);
    else setEtapaAtual((prev) => Math.max(prev - 1, 1));
  };

  // Visualizar em uma nova aba
  const handleVisualizar = () => {
    if (docSelecionado?.path) {
      window.open(
        `http://localhost:5000/api/files/${docSelecionado.path}`,
        "_blank"
      );
    } else {
      alert("Arquivo não encontrado!");
    }
  };

  // Baixar arquivo
  const handleDownload = () => {
    if (docSelecionado?.path) {
      const link = document.createElement("a");
      link.href = `http://localhost:5000/api/files/${docSelecionado.path}`;
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
      console.log(response.data);

      // Remove da lista
      setDocumentos((prev) => prev.filter((d) => d.id !== docSelecionado.id));

      // Reset estados
      setDocSelecionado(null);
      setSelectedModel(null);
      setIsResponse(false);
      setEtapaAtual(1);

      // Alerta de sucesso
      setAlertSuccess("Documento apagado com sucesso!");
      setTimeout(() => setAlertSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao apagar documento:", error);

      // Alerta de erro
      setAlertError("Erro ao apagar documento!");
      setTimeout(() => setAlertError(null), 3000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedModel) return;
      if (e.key === "ArrowRight") handleProxima();
      else if (e.key === "ArrowLeft") handleVoltar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModel, etapaAtual, anexou]);

  return (
    <div className="background">
      {/* Action Bar */}
      <div className="action-bar">
        <div className="select">
          <div className="flex-left-right">
            {/* 1 Documento selecionado */}
            {docSelecionado && !selectedModel && (
              <div className="flex-left-right">
                <div className="flex-down-top">
                  <h4>Arquivo selecionado</h4>
                  <div className="flex-left-right" style={{ marginTop: 5 }}>
                    <Icons.Selected size={15} className="controle" />
                    <h3 className="controle">{docSelecionado.templateName ? docSelecionado.templateName : docSelecionado.name}</h3>
                  </div>
                </div>

              {/* barra para separar */}
              <div style={{margin: "0 20px"}}>|</div>

                <div className="flex-down-top" style={{ margin: "0 20px 0 0" }}>
                  <h4>Modelo selecionado</h4>
                  <div className="flex-left-right" style={{ marginTop: 5 }}>
                    <Icons.Selected size={15} className="controle" />
                    <h3 className="controle">{docSelecionado.model}</h3>
                  </div>
                </div>

              {/* barra para separar */}
              <div style={{margin: "0 20px"}}>|</div>

                <div className="flex-down-top" style={{ margin: "0 20px 0 0" }}>
                  <h4>Data de criação</h4>
                  <div className="flex-left-right" style={{ marginTop: 5 }}>
                    <Icons.Selected size={15} className="controle" />
                    <h3 className="controle">{docSelecionado.uploadedAt}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* 2 Modelo selecionado */}
            {selectedModel && !docSelecionado && (
              <div className="flex-down-top" style={{ margin: "0 20px 0 0" }}>
                <h4>Selecionar modelo</h4>
                <div className="flex-left-right" style={{ marginTop: 5 }}>
                  <Icons.Selected size={15} className="controle" />
                  <h3 className="controle">
                    Modelo {selectedModel?.name} selecionado
                  </h3>
                </div>
              </div>
            )}

            {/* 3 Quantidade de tags */}
            {selectedModel && selectedTags?.length >= 1 && etapaAtual >= 2 && (
              <div className="flex-down-top" style={{ margin: "0 20px" }}>
                <h4>Quantidade de tags</h4>
                <div className="flex-left-right" style={{ marginTop: 5 }}>
                  <Icons.Tags size={15} className="icons" />
                  <h3>{selectedTags.length} tags selecionadas</h3>
                </div>
              </div>
            )}

            {/* 4 Arquivo selecionado na etapa 3 */}
            {etapaAtual === 3 && file && (
              <div className="flex-down-top" style={{ marginLeft: 20 }}>
                <h4>Arquivo selecionados</h4>
                <div className="flex-left-right" style={{ marginTop: 5 }}>
                  <Icons.FiFileText size={15} className="controle" />
                  <h3 className="controle">{file.name}</h3>
                </div>
              </div>
            )}

            {/* 5️ Caso nada esteja selecionado */}
            {!docSelecionado && !selectedModel && (
              <div>
                <h3>Selecione algo</h3>
              </div>
            )}
          </div>

          <div className="spc-bet flex-left-right" style={{ width: "9%" }}>
            <button className="action-btns">
              <Icons.Add size={20} />
            </button>
            <button className="action-btns">
              <Icons.MdOutlineMoreHoriz
                size={20}
                onClick={() => setMore(!more)}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Area */}
      <div className="middle-area">
        {selectedModel &&
          (selectedTags?.length ?? 0) >= 1 &&
          etapaAtual === 3 &&
          !file && <div className="alert">Nenhum arquivo foi anexado</div>}

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
                  <h3>Duvidas sobre</h3>
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
          etapas={ETAPAS}
          etapaAtual={etapaAtual}
          setEtapaAtual={goToEtapa}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          file={file}
          setFile={(f) => {
            setFile(f);
            if (f) setAnexou(true);
          }}
          anexou={anexou}
          setAnexou={setAnexou}
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
        />
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        {selectedModel ? (
          <div className="spc-bet">
            <div className="flex-top-down">
              <h4>Indicador de passos</h4>
              <div
                className="flex-left-right"
                style={{ marginTop: 10, alignItems: "center" }}
              >
                <Icons.Selected
                  size={15}
                  style={{ marginRight: 10, color: "#597dff" }}
                />
                <h3 className="controle">
                  {etapaAtual} de {ETAPAS.length}
                </h3>
              </div>
            </div>
            <div className="flex-left-right">
              <button className="Status-btn" onClick={handleVoltar}>
                Voltar
              </button>
              {etapaAtual <= 2 && (
                <button className="Status-btn" onClick={handleProxima}>
                  Próxima
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <button className="Status-btn" style={{ opacity: 0.5 }}>
              Salvar modificações
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Block;
