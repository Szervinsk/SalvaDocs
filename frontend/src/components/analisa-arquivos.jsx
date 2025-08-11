import { useState } from "react";
import { LuFileSearch } from "react-icons/lu";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";

function AnalisarArquivos() {
  const defaultMessage =
    "Use o modelo Despachos para análise automatizada de documentos do tipo despacho, identificando dados específicos com base em critérios definidos.";

  const [text, setText] = useState(defaultMessage);

  const models = [
    { id: 1, text: "Despachos" },
    { id: 2, text: "Programas de Integridade" },
    { id: 3, text: "Pareceres" },
  ];

  const handleModelText = (id) => {
    if (id === 1) {
      setText(
        "Use o modelo Despachos para análise automatizada de documentos do tipo despacho, identificando dados específicos com base em critérios definidos."
      );
    } else if (id === 2) {
      setText(
        "Use o modelo Programa de Integridade para análise automatizada de documentos desse tipo, identificando dados específicos com base em critérios definidos."
      );
    } else {
      setText(
        "Use o modelo Parecer para análise automatizada de documentos desse tipo, identificando dados específicos com base em critérios definidos."
      );
    }
  };

  return (
    <div className="AnalisaArquivos">
      <LuFileSearch size={30} className="icons" />
      <h2>Analisador de arquivos</h2>
      <h3>
        Selecione abaixo o modelo de captura de dados desejado para o arquivo
        enviado
      </h3>

      <div className="flex-left-right">
        {models.map((model) => (
          <div
            key={model.id}
            className="Models-btn"
            onMouseEnter={() => handleModelText(model.id)}
            onMouseLeave={() => setText(defaultMessage)}
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
} export default AnalisarArquivos;