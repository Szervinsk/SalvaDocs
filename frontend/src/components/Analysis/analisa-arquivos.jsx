import { useEffect, useState } from "react";
import { Icons } from "../../constants/icons";
import axios from "axios";

import EditVariables from "./editContents/edit-variables";
import EditEtapas from "./editContents/edit-etapas";

function AnalisarArquivos({
  openDocsVisible,
  selectedModel,
  setModelos,
  modelos,
  setSelectedModel,
  etapas,
  etapaAtual,
  setEtapaAtual,
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
  user,
  setDocumentos,
  setIsResponse,
  setTool,
  tags,
  setTags
}) {
  const handleCloseModal = () => setSelectedModel(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/models/")
      .then((res) => {
        console.log(res.data);
        setModelos(res.data);
      })
      .catch((err) => console.error("Erro ao buscar modelos:", err));
  }, []); 



  const defaultMessage =
    "Use o modelo Despachos para análise automatizada de documentos.";
  const [text, setText] = useState(defaultMessage);

  const handleModelText = (model) => {
    setText(`Use o modelo ${model.name} para análise automatizada de documentos.`);
  };

  if (selectedModel !== null) {
    return (
      <div className="analyse-content">
        <EditVariables
          etapas={etapas}
          etapaAtual={etapaAtual}
          setEtapaAtual={setEtapaAtual}
          selectedModel={selectedModel}
          onClose={handleCloseModal}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          file={file}
          setFile={setFile}
          erroArquivo={erroArquivo}
          setIsResponse={setIsResponse}
          setDocSelecionado={setDocSelecionado}
          tags={tags}
          setTags={setTags}
          setDocumentos={setDocumentos}
          setTool={setTool}
          user={user}
        />

        <EditEtapas
          etapas={etapas}
          etapaAtual={etapaAtual}
          setEtapaAtual={setEtapaAtual}
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
  }

  return (
    <div className="AnalisaArquivos">
      <Icons.Search size={30} className="icons" />
      <h2>Analisador de arquivos</h2>
      <h3>Selecione abaixo o modelo de captura de dados desejado</h3>

      <div className="model-list" style={{ flexDirection: !openDocsVisible ? "row" : "column" }}>
        {modelos.map((model) => (
          <div
            key={model.id}
            className="Models-btn"
            onMouseEnter={() => handleModelText(model)}
            onMouseLeave={() => setText(defaultMessage)}
            onClick={() => setSelectedModel(model)}
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


export default AnalisarArquivos;
