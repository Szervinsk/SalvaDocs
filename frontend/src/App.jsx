import "./styles/global.css";
import { useState } from "react";
import { MODELOS, PASTAS } from "../src/constants/constants";
import Block from "../src/components/block";
import DynamicsStaticts from "../src/components/dynstatistics";
import FoldersAction from "../src/components/folders-action";

function Abas() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [tool, setTool] = useState(null);

  return (
    <div className="main-container">
      <FoldersAction // mexer depois pois está me dando dor de cabeça
        pastas={PASTAS}
        documentos={documentos}
        setDocumentos={setDocumentos}
        docSelecionado={docSelecionado}
        setDocSelecionado={setDocSelecionado}
        setTool={setTool}
      />

      <div className="background-block">
        {tool === 1 ? (
          <Block
            modelos={MODELOS} // lista de modelos
            selectedModel={selectedModel} // envia modelo selecionado
            setSelectedModel={setSelectedModel} // altera modelo selecionado
            setDocSelecionado={setDocSelecionado}
            docSelecionado={docSelecionado}
            setDocumentos={setDocumentos}
            onVoltar={() => setTool(null)}
          />
        ) : (
          <DynamicsStaticts documentos={documentos} />
        )}
      </div>
    </div>
  );
}

export default Abas;
