import "./styles/global.css";
import "./styles/searchbar.css";
import { useState } from "react";
import { MODELOS, PASTAS } from "../src/constants/constants";
import Block from "../src/components/block";
import FoldersAction from "./components/bars/folders-action";
import Navbar from "./components/bars/navbar";
import AuthForm from "./components/login/authForm";

function Abas() {
  const [isLogged, setIsLogged] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [tool, setTool] = useState(null);
  const [user, setUser] = useState(null);

  // novo estado para abrir/fechar pastas
  const [pastasAbertas, setPastasAbertas] = useState(false);

  if (!isLogged) return <AuthForm isLogged={isLogged} setIsLogged={setIsLogged} user={user} setUser={setUser} />;

  return (
    <div className="main-container">
      <Navbar
        setTool={setTool}
        tool={tool}
        setDocSelecionado={setDocSelecionado}
      />

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
            setTool={setTool}
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
          user={user}
        />
      </div>
    </div>
  );
}

export default Abas;
