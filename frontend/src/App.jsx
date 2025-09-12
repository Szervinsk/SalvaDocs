import "./styles/global.css";
import "./styles/searchbar.css";
import { useEffect, useState } from "react";
import { PASTAS } from "../src/constants/constants";
import Block from "../src/components/block";
import FoldersAction from "./components/bars/folders-action";
import Navbar from "./components/bars/navbar";
import AuthForm from "./components/login/authForm";

function Abas() {
  const [isLogged, setIsLogged] = useState(false); // verificar se está logado

  // estados principais
  const [selectedModel, setSelectedModel] = useState(null);
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [tool, setTool] = useState(null);
  const [user, setUser] = useState(null);
  const [barraLateral, setBarraLateral] = useState(true);

  // novo estado para abrir/fechar pastas
  const [pastasAbertas, setPastasAbertas] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchMe(token);
    }
  }, []);

  const fetchMe = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include", // permite enviar cookies
      });

      if (!res.ok) throw new Error("Token inválido");

      const data = await res.json();
      setUser(data);
      setIsLogged(true);
    } catch (err) {
      console.log("Não logado:", err);
      setIsLogged(false);
    }
  };

  if (!isLogged)
    return (
      <AuthForm
        isLogged={isLogged}
        setIsLogged={setIsLogged}
        user={user}
        setUser={setUser}
      />
    );

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
            setBarraLateral={setBarraLateral}
            barraLateral={barraLateral}
          />
        </div>

        {/* Aqui variam os outros blocos */}
        <Block
          setModelos={setModelos}
          modelos={modelos}
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
          barraLateral={barraLateral}
          setBarraLateral={setBarraLateral}
        />
      </div>
    </div>
  );
}

export default Abas;
