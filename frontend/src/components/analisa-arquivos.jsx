import { useState } from "react";
import { LuFileSearch } from "react-icons/lu";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import EditVariables from "./edit-variables";

function AnalisarArquivos({ modelos, selectedModel, setSelectedModel, etapas, etapaAtual, setEtapaAtual }) {
  const defaultMessage = "Use o modelo Despachos para análise automatizada de documentos.";

  const [text, setText] = useState(defaultMessage);

  const handleCloseModal = () => {
    setSelectedModel(null); // volta pro estado inicial
  };

  const handleModelText = (id) => {
    const model = modelos.find(m => m.id === id);
    if (model) setText(`Use o modelo ${model.text} para análise automatizada de documentos.`);
  };

  // Se um modelo foi selecionado, exibe o modal de edição
  if (selectedModel !== null) {
    return (
      <EditVariables
        etapas={etapas}
        etapaAtual={etapaAtual}
        modelId={selectedModel}
        onClose={handleCloseModal}
      />
    );
  }

  return (
    <div className="AnalisaArquivos">
      <LuFileSearch size={30} className="icons" />
      <h2>Analisador de arquivos</h2>
      <h3>Selecione abaixo o modelo de captura de dados desejado</h3>

      <div className="flex-left-right">
        {modelos.map((model) => (
          <div
            key={model.id}
            className="Models-btn"
            onMouseEnter={() => handleModelText(model.id)}
            onMouseLeave={() => setText(defaultMessage)}
            onClick={() => setSelectedModel(model.text)}
          >
            <MdOutlineDocumentScanner size={20} className="icons" />
            <h3>{model.text}</h3>
          </div>
        ))}
      </div>

      <div className="Models-text">
        <FaRegLightbulb size={20} className="icons" />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default AnalisarArquivos;
