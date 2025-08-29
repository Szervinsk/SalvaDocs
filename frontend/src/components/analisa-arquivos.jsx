import { useState } from "react";
import { Icons } from "../constants/icons";
import { TAGS } from "../constants/constants";

import EditVariables from "./edit-variables";
import EditEtapas from "./edit-etapas";
import OpenDocs from "./open-docs";

function AnalisarArquivos({
  modelos,
  selectedModel,
  setSelectedModel,
  etapas,
  etapaAtual,
  setEtapaAtual, // agora é o goToEtapa
  selectedTags,
  setSelectedTags,
  file,
  setFile,
  erroArquivo,
  handleClick,
  isEtapaDisabled,
  setTremer,
  tremer,
  closeAlert,
  setCloseAlert,
  setDocSelecionado,
  docSelecionado,
  onVoltar,
  setDocumentos,
  setIsResponse,
  isResponse,
  showAlert,
}) {
  const handleCloseModal = () => {
    setSelectedModel(null);
  }; // fechar content pelo x

  const defaultMessage =
    "Use o modelo Despachos para análise automatizada de documentos.";

  const [text, setText] = useState(defaultMessage); // texto para explicar os modelos

  const handleModelText = (model) => {
    setText(
      `Use o modelo ${model.name} para análise automatizada de documentos.`
    );
  };

  // Se um modelo foi selecionado, exibe o modal de edição
  if (docSelecionado || isResponse) {
    return (
      <OpenDocs
        onClose={() => (
          setIsResponse(false), setDocSelecionado(null), setEtapaAtual(1)
        )}
        docSelecionado={docSelecionado}
        tags={docSelecionado?.tags ?? []}
        onVoltar={onVoltar}
        setDocSelecionado={setDocSelecionado}
        setDocumentos={setDocumentos}
        setSelectedModel={setSelectedModel}
        showAlert={showAlert}
        setIsResponse={setIsResponse}
      />
    );
  } else if (selectedModel !== null) {
    return (
      <div className="flex-left-right , spc-bet">
        <EditVariables
          etapas={etapas}
          etapaAtual={etapaAtual}
          selectedModel={selectedModel}
          onClose={handleCloseModal}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          file={file}
          setFile={setFile}
          erroArquivo={erroArquivo}
          setIsResponse={setIsResponse}
          setDocSelecionado={setDocSelecionado}
          tags={TAGS}
          setDocumentos={setDocumentos}
        />

        <EditEtapas
          etapas={etapas}
          etapaAtual={etapaAtual}
          setEtapaAtual={setEtapaAtual}
          alert={alert}
          tremer={tremer}
          setTremer={setTremer}
          closeAlert={closeAlert}
          setCloseAlert={setCloseAlert}
          handleClick={handleClick}
          isEtapaDisabled={isEtapaDisabled}
          file={file}
        />
      </div>
    );
  } else {
    return (
      <div className="AnalisaArquivos">
        <Icons.Search size={30} className="icons" />
        <h2>Analisador de arquivos</h2>
        <h3>Selecione abaixo o modelo de captura de dados desejado</h3>

        <div className="flex-left-right">
          {modelos.map((model) => (
            <div
              key={model.id}
              className="Models-btn"
              onMouseEnter={() => handleModelText(model)}
              onMouseLeave={() => setText(defaultMessage)}
              onClick={() => setSelectedModel(model)} // agora salva o objeto inteiro
            >
              <Icons.ScannerDocument size={20} className="icons" />
              <h3>{model.name}</h3>
            </div>
          ))}
        </div>

        <div className="Models-text">
          <Icons.Lamp size={20} className="icons" />
          <p>{text}</p>
        </div>
      </div>
    );
  }
}

export default AnalisarArquivos;
