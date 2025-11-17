import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./login";
import Cadastro from "./sign";
import ResetPassword from "./reset"; // <---- adicione seu componente aqui!
import "./auth.css";
import { Icons } from "../../constants/icons";
import Logo from "../../../src/assets/pen.svg";
import appPhoto from "../../assets/Photo.png";

// Componente para a coluna de branding (visual)
const AuthBranding = () => (
  <div className="auth-branding">
    <div className="branding-content">
      <div className="branding-footer">
        <h3>Transforme Documentos em Dados.</h3>
        <p>
          Nossa plataforma com IA integrada analisa seus arquivos, extrai informações
          essenciais e organiza tudo para você.
        </p>
        <img src={appPhoto} alt="Visualização do aplicativo" />
      </div>
    </div>
  </div>
);

// Componente principal do formulário de autenticação
function AuthForm({ onLoginSubmit, onSignupSubmit }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Funções "wrapper" que adicionam estado de loading e erro ao chamar as props
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      await onLoginSubmit(credentials);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (details) => {
    setLoading(true);
    setError("");
    try {
      await onSignupSubmit(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: mode === "login" ? -50 : 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: mode === "login" ? 50 : -50 },
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <motion.div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="logo-wrapper">
            <img src={Logo} alt="SalvaDocs Logo" className="logo-icon" />
            <motion.h2 className="app-title">SalvaDocs</motion.h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              {mode === "login" ? (
                <Login
                  onSubmit={handleLogin}
                  loading={loading}
                  err={error}
                  switchToSignup={() => setMode("signup")}
                  switchToReset={() => setMode("reset")} // <---- callback para reset
                />
              ) : mode === "signup" ? (
                <Cadastro
                  onSubmit={handleSignup}
                  loading={loading}
                  err={error}
                  switchToLogin={() => setMode("login")}
                />
              ) : (
                <ResetPassword
                  loading={loading}
                  switchToLogin={() => setMode("login")} // <--- retorna para login
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <AuthBranding />
    </main>
  );
}

export default AuthForm;