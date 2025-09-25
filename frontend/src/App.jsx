import "./styles/main.css"
import { useEffect, useState } from "react";

import { PASTAS } from "../src/constants/constants";

// COMPONENTES
import Block from "../src/components/block";
import Navbar from "./components/bars/navbar/navbar";
import FoldersAction from "./components/bars/library/folders-action"
import AuthForm from "./components/auth/authForm";
import axios from "axios";
import Welcome from "./components/alerts/welcome";

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
  
  //efeito darkmode
  const [darkMode, setDarkMode] = useState(false);

  // alertas de welcome / aviso
  const [alert, setAlert] = useState(false);

  // novo estado para abrir/fechar pastas
  const [pastasAbertas, setPastasAbertas] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchMe(token);
    }
  }, []);

  const handleLogout = () => {
    axios.post("http://localhost:5000/api/auth/logout");
    localStorage.removeItem("accessToken"); // limpa o token
    setUser(null);
    setIsLogged(false);
  };

  const fetchMe = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include", // permite enviar cookies
      });

      if (!res.ok) {
        console.log("Token Inválido")
        setIsLogged(false);
      }

      const data = await res.json();
      setUser(data);
      setIsLogged(true);
      setAlert(true)
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
  else {

  }
  return (

    <>
      {alert && <Welcome user={user} />}

      <div className="main-container">
        <Navbar
          setTool={setTool}
          tool={tool}
          setDocSelecionado={setDocSelecionado}
          user={user}
          onLogout={handleLogout}
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
            setDarkMode={setDarkMode}
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
}

export default Abas;
