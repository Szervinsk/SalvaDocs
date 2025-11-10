import "./styles/main.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

// COMPONENTES
import Block from "../src/components/block";
import Navbar from "./components/bars/navbar/navbar";
import FoldersAction from "./components/bars/library/folders-action";
import AuthForm from "./components/auth/authForm";
import Alerts from "./components/alerts/alerts";
import Welcome from "./components/alerts/Welcome";

// Configuração global do Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000/api";

// Interceptor de REQUISIÇÃO: Anexa o token de acesso a cada chamada
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  // Estados de UI e Autenticação
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [tool, setTool] = useState(1);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados de Configuração
  const [darkMode, setDarkMode] = useState(false);
  const [pastasAbertas, setPastasAbertas] = useState(true);
  const [dataView, setDataView] = useState(false);
  const [showAlternativeTools, setShowAlternativeTools] = useState(false);

  // Estados de Dados
  const [selectedModel, setSelectedModel] = useState(null);
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [pastas, setPastas] = useState([]);

  // Estado para aplicar o boas vindas para o usuário
  const [showWelcome, setShowWelcome] = useState(false);

  // Efeito para decidir se mostra o welcome
  useEffect(() => {
    if (isLogged && user && !user.welcomeDismissed) {
      setShowWelcome(true);
    }
  }, [isLogged, user]);

  // Função para marcar o welcome como visto no backend
  const handleFinishWelcome = async () => {
    try {
      await axios.put('/users/welcome'); // Chama a rota que criamos
      // Atualiza o estado local para não mostrar de novo nesta sessão
      setUser(prev => ({ ...prev, welcomeDismissed: true }));
      setShowWelcome(false);
    } catch (err) {
      console.error("Erro ao dispensar boas-vindas:", err);
      setShowWelcome(false); // Fecha mesmo se a API falhar
    }
  };

  // Função para navegar para a página de conta
  const goToAccountPage = () => {
    setTool(5); // O ID da ferramenta "Minha Conta"
  };

  // Função para exibir alertas, memorizada para estabilidade
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  // Função de logout forçado, para ser usada pelo interceptor
  const forceLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    if (isLogged) { // Só mostra o alerta se o usuário estava de fato logado
      showAlert("warning", "Sua sessão expirou. Por favor, faça login novamente.");
    }
    setUser(null);
    setIsLogged(false);
    setDocumentos([]);
    setPastas([]);
    setModelos([]);
  }, [showAlert, isLogged]);

  // Interceptor de RESPOSTA: Lida com a expiração do token de forma inteligente
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if ((status === 401 || status === 403) && !originalRequest._retry) {
          originalRequest._retry = true;

          // Não tenta dar refresh para rotas de autenticação que já falharam
          if (originalRequest.url.includes("/auth/")) {
            return Promise.reject(error);
          }

          try {
            const { data } = await axios.post("/auth/refresh-token");
            localStorage.setItem("accessToken", data.accessToken);
            return axios(originalRequest);
          } catch (refreshError) {
            forceLogout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [forceLogout]);

  // Função centralizada para atualizar todos os dados da aplicação
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [pastasRes, documentosRes, modelosRes] = await Promise.all([
        axios.get(`/folders`),
        axios.get(`/documents`),
        axios.get(`/modelos`),
      ]);
      setPastas(pastasRes.data);
      setDocumentos(documentosRes.data);
      setModelos(modelosRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados da aplicação:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Array de dependências vazio, pois os setters são estáveis.

  // Lógica de Atalhos de Teclado
  const handleKeyDown = useCallback((event) => {
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }
    if (event.shiftKey) {
      event.preventDefault();
      switch (event.key.toUpperCase()) {
        case 'A': setTool(1); break;
        case 'R': setTool(2); break;
        case 'G': setTool(3); break;
        case 'B': setTool(4); break; 
        case 'M': setTool(5); break;
        // Atalhos para o modal de c
        case 'D': setTool(6); break;
        case 'P': setTool(7); break;
        case 'U': setTool(8); break;
        default: return;
      }
    }
  }, [setTool]);

  // Refs para a rolagem do EditModels
  const tagsRef = useRef(null);
  const modelosRef = useRef(null);
  const pastasRef = useRef(null);

  const handleScrollTo = (area) => {
    const refs = {
      Tags: tagsRef,
      Modelos: modelosRef,
      Pastas: pastasRef,
    };
    const ref = refs[area];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Efeito para verificar a sessão do usuário (roda apenas uma vez)
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get(`/auth/me`);
          if (response.data) {
            setUser(response.data);
            setIsLogged(true);
          }
        } catch (error) {
          // O token no localStorage é inválido/expirado, o interceptor vai tentar dar refresh.
          // Se falhar, o forceLogout será chamado, então não precisamos fazer nada aqui.
          setIsLogged(false);
        }
      } else {
        setIsLogged(false);
      }
      setLoading(false); // Finaliza o loading inicial em todos os casos
    };
    checkUserSession();
  }, []); // O array vazio garante que rode apenas uma vez na montagem do App

  // Efeito para buscar os dados iniciais assim que o usuário é considerado logado
  useEffect(() => {
    if (isLogged) {
      refreshData();
    }
  }, [isLogged, refreshData]);

  // Função de logout manual
  const handleLogout = async () => {
    try {
      await axios.post(`/auth/logout`);
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsLogged(false);
      showAlert("success", "Logout realizado com sucesso!");
    } catch (error) {
      showAlert("error", "Ocorreu um erro ao sair.");
    }
  };

  // Funções de Login e Cadastro que serão passadas para o AuthForm
  const handleLogin = async (credentials) => {
    const { data } = await axios.post(`/auth/login`, credentials);
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    setIsLogged(true);
    showAlert("success", `Bem-vindo de volta, ${data.user.username}!`);
  };

  const handleSignup = async (details) => {
    await axios.post(`/auth/register`, details);
    showAlert("success", "Cadastro realizado! Fazendo login...");
    await handleLogin({ email: details.email, password: details.password });
  };

  if (loading) {
    return <div className="loading-container">Carregando SalvaDocs...</div>;
  }

  if (!isLogged) {
    return (
      <AuthForm
        onLoginSubmit={handleLogin}
        onSignupSubmit={handleSignup}
      />
    );
  }

  return (
    <>
      <AnimatePresence>
        {alert && <Alerts type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcome && (
          <Welcome
            onFinish={handleFinishWelcome}
            goToAccount={goToAccountPage}
          />
        )}
      </AnimatePresence>

      <div className="main-container">
        <Navbar
          setTool={setTool}
          tool={tool}
          user={user}
          onLogout={handleLogout}
          showAlternativeTools={showAlternativeTools}
          setDarkMode={setDarkMode}
          darkMode={darkMode}
          dataView={dataView}
          setDataView={setDataView}
          tagsRef={tagsRef}
          modelosRef={modelosRef}
          pastasRef={pastasRef}
          handleScrollTo={handleScrollTo} />

        <div className="background-block">
          {pastasAbertas && (
            <FoldersAction
              pastas={pastas}
              documentos={documentos}
              loading={loading}
              docSelecionado={docSelecionado}
              setDocSelecionado={setDocSelecionado}
              onDataChange={refreshData}
              showAlert={showAlert}
            />
          )}
          <Block
            pastas={pastas}
            modelos={modelos}
            documentos={documentos}
            setDocumentos={setDocumentos}
            onDataChange={refreshData}
            user={user}
            setUser={setUser}
            tool={tool}
            setTool={setTool}
            dataView={dataView} // Passa o estado
            setDataView={setDataView} // Passa o setter
            docSelecionado={docSelecionado}
            setDocSelecionado={setDocSelecionado}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            showAlert={showAlert}
            onLogout={handleLogout}
            setPastasAbertas={setPastasAbertas}
            pastasAbertas={pastasAbertas}
            loading={loading}
            onToggleFavorite={() => { }} // Placeholder para a função de favorito
            favoriteModelIds={[]} // Placeholder para os favoritos

            // Passa as refs de rolagem
            tagsRef={tagsRef}
            modelosRef={modelosRef}
            pastasRef={pastasRef}
            handleScrollTo={handleScrollTo}
          />
        </div>
      </div>
    </>
  );
}

export default App;