import "./styles/global.css";
import { useState } from "react";
import { MODELOS, PASTAS } from "../src/constants/constants";
import Block from "../src/components/block";
import DynamicsStaticts from "../src/components/dynstatistics";
import FoldersAction from "../src/components/folders-action";
import Navbar from "./components/navbar";

function Abas() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [tool, setTool] = useState(null);
  const [reduzido, setReduzido] = useState(null);

  // novo estado para abrir/fechar pastas
  const [pastasAbertas, setPastasAbertas] = useState(false);

  return (
    <div className="main-container">
      <Navbar setTool={setTool} setDocSelecionado={setDocSelecionado}/>

      <div className="background-block">
        {/* Pasta sempre aparece */}
        <div
          className={`folders-container ${pastasAbertas ? "open" : "closed"}`}
        >
          <FoldersAction
            pastas={PASTAS}
            documentos={documentos}
            setDocumentos={setDocumentos}
            docSelecionado={docSelecionado}
            setDocSelecionado={setDocSelecionado}
            onToggle={() => setPastasAbertas(!pastasAbertas)}
            setReduzido={setReduzido}
            setTool={setTool}
            reduzido={reduzido}
          />
        </div>

        {/* Aqui variam os outros blocos */}
        <Block
          modelos={MODELOS}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          documentos={documentos}
          setDocumentos={setDocumentos}
          docSelecionado={docSelecionado}
          setDocSelecionado={setDocSelecionado}
          onVoltar={() => setTool(null)}
          tool={tool}
          setTool={setTool}
        />
      </div>
    </div>
  );
}

export default Abas;
