import "./styles/main.css";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

// COMPONENTES
import Block from "../src/components/block";
import Navbar from "./components/bars/navbar/navbar";
import FoldersAction from "./components/bars/library/folders-action";
import AuthForm from "./components/auth/authForm";
import Alerts from "./components/alerts/alerts";

axios.defaults.withCredentials = true;
const baseURL = "http://localhost:5000/api";

function App() {
  // Estados de UI e Autenticação
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [tool, setTool] = useState(1);
  const [pastasAbertas, setPastasAbertas] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados de Dados (A FONTE DA VERDADE)
  const [selectedModel, setSelectedModel] = useState(null);
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [pastas, setPastas] = useState([]);

  // O array de dependências vazio `[]` garante que a função NUNCA será recriada.
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  // FUNÇÃO CENTRALIZADA PARA ATUALIZAR TODOS OS DADOS
  const refreshData = async () => {
    if (!loading) setLoading(true);
    try {
      const [pastasRes, documentosRes, modelosRes] = await Promise.all([
        axios.get(`${baseURL}/folders`),
        axios.get(`${baseURL}/files/documentos`),
        axios.get(`${baseURL}/modelos`),
      ]);
      setPastas(pastasRes.data);
      setDocumentos(documentosRes.data);
      setModelos(modelosRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados da aplicação:", error);
      showAlert("error", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await axios.get(`${baseURL}/auth/me`);
        if (response.data) {
          setUser(response.data);
          setIsLogged(true);
        }
      } catch (error) {
        setIsLogged(false);
      }
    };
    checkUserSession();
  }, []);

  useEffect(() => {
    if (isLogged) {
      refreshData();
    }
  }, [isLogged]);

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/auth/logout`);
      setUser(null);
      setIsLogged(false);
      setDocumentos([]);
      setPastas([]);
      setModelos([]);
      showAlert("success", "Logout realizado com sucesso!");
    } catch (error) {
      showAlert("error", "Ocorreu um erro ao sair.");
    }
  };

  if (!isLogged) {
    return <AuthForm setIsLogged={setIsLogged} setUser={setUser} showAlert={showAlert} baseURL={baseURL} />;
  }

  return (
    <>
      <AnimatePresence>
        {alert && <Alerts type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      </AnimatePresence>
      <div className="main-container">
        <Navbar setTool={setTool} tool={tool} user={user} onLogout={handleLogout} />
        <div className="background-block">
          {pastasAbertas && (
            <FoldersAction
              pastas={pastas}
              documentos={documentos}
              loading={loading}
              docSelecionado={docSelecionado}
              setDocSelecionado={setDocSelecionado}
            />
          )}
          <Block
            pastas={pastas}
            modelos={modelos}
            documentos={documentos}
            setPastas={setPastas}
            setModelos={setModelos}
            setDocumentos={setDocumentos}
            onDataChange={refreshData} // A função de refresh
            user={user}
            tool={tool}
            setTool={setTool}
            docSelecionado={docSelecionado}
            setDocSelecionado={setDocSelecionado}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            showAlert={showAlert}
            baseURL={baseURL}
            setUser={setUser}
            onLogout={handleLogout}
            setPastasAbertas={setPastasAbertas}
            pastasAbertas={pastasAbertas}
          />
        </div>
      </div>
    </>
  );
}

export default App;