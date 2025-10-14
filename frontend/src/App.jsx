import "./styles/main.css";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios"; // Importação do axios

// COMPONENTES
import Block from "../src/components/block";
import Navbar from "./components/bars/navbar/navbar";
import FoldersAction from "./components/bars/library/folders-action";
import AuthForm from "./components/auth/authForm";
import Alerts from "./components/alerts/alerts";

// Configura a URL base para todas as chamadas do axios
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true; // Permite o envio de cookies

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);

  // Estados principais
  const [selectedModel, setSelectedModel] = useState(null);
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [pastas, setPastas] = useState([]);
  const [tool, setTool] = useState(1);
  const [pastasAbertas, setPastasAbertas] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [alert, setAlert] = useState(null);

  // Função para exibir alertas na tela
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Efeito para alternar o tema dark/light
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Efeito para verificar a sessão do usuário ao carregar a página
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await axios.get("/auth/me");
        if (response.data) {
          setUser(response.data);
          setIsLogged(true);
        }
      } catch (error) {
        console.log("Nenhum usuário logado na sessão.");
        setIsLogged(false);
      }
    };
    checkUserSession();
  }, []);

  // Efeito para buscar os dados iniciais assim que o usuário loga
  useEffect(() => {
    const fetchInitialData = async () => {
      if (isLogged) {
        try {
          // Busca pastas, documentos e modelos em paralelo para otimizar
          const [pastasRes, documentosRes, modelosRes] = await Promise.all([
            axios.get("http://localhost:5000/api/folders"),
            axios.get("http://localhost:5000/api/files/documentos"),
            axios.get("http://localhost:5000/api/modelos"),
          ]);
          setPastas(pastasRes.data);
          setDocumentos(documentosRes.data);
          setModelos(modelosRes.data);

          showAlert("sucess", "Dados carregados com sucesso da sua biblioteca!")
        } catch (error) {
          console.error("Erro ao buscar dados iniciais:", error);
          showAlert("error", "Não foi possível carregar os dados da sua biblioteca.");
        }
      }
    };
    fetchInitialData();
  }, [isLogged]); // Executa sempre que o status de login mudar

  // Função de logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      setUser(null);
      setIsLogged(false);
      // Limpa os dados para evitar que o próximo usuário os veja
      setDocumentos([]);
      setPastas([]);
      setModelos([]);
      showAlert("success", "Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      showAlert("error", "Ocorreu um erro ao sair.");
    }
  };

  // Se o usuário não estiver logado, exibe o formulário de autenticação
  if (!isLogged) {
    return (
      <AuthForm
        setIsLogged={setIsLogged}
        setUser={setUser}
        showAlert={showAlert}
      />
    );
  }

  // Se estiver logado, exibe a aplicação principal
  return (
    <>
      <AnimatePresence>
        {alert && (
          <Alerts
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>

      <div className="main-container">
        <Navbar setTool={setTool} tool={tool} user={user} onLogout={handleLogout} />
        <div className="background-block">
          {pastasAbertas && (
            <FoldersAction
              pastas={pastas}
              setPastas={setPastas}
              documentos={documentos}
              setDocumentos={setDocumentos}
              docSelecionado={docSelecionado}
              setDocSelecionado={setDocSelecionado}
              showAlert={showAlert}
            />
          )}
          <Block
            setModelos={setModelos}
            modelos={modelos}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            documentos={documentos}
            setDocumentos={setDocumentos}
            docSelecionado={docSelecionado}
            setDocSelecionado={setDocSelecionado}
            tool={tool}
            setTool={setTool}
            user={user}
            pastas={pastas}
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            showAlert={showAlert}
          />
        </div>
      </div>
    </>
  );
}

export default App;