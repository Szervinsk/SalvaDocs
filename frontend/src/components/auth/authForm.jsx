import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./login";
import Cadastro from "./sign";
import "./auth.css";

function AuthForm({ setIsLogged, setUser, baseURL}) {
  const [mode, setMode] = useState("login"); // 'login' ou 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função unificada para realizar a autenticação e definir o usuário
  const authenticateAndSetUser = async (token) => {
    try {
      const res = await fetch(`${baseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Sessão inválida. Por favor, entre novamente.");
      const userInfo = await res.json();
      setUser(userInfo);
      setIsLogged(true);
    } catch (err) {
      localStorage.removeItem("accessToken");
      setError(err.message);
    }
  };

  // Checa o token ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      authenticateAndSetUser(token);
    }
  }, [setUser, setIsLogged]);

  // Função para lidar com o login
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no login.");
      
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      setIsLogged(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o cadastro
  const handleSignup = async (details) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao cadastrar.");

      // Após o cadastro, faz o login automaticamente
      await handleLogin({ email: details.email, password: details.password });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: mode === 'login' ? -100 : 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: mode === 'login' ? 100 : -100 },
  };

  return (
    <main className="auth-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="auth-card"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {mode === "login" ? (
            <Login
              onSubmit={handleLogin}
              loading={loading}
              err={error}
              switchToSignup={() => setMode("signup")}
            />
          ) : (
            <Cadastro
              onSubmit={handleSignup}
              loading={loading}
              err={error}
              switchToLogin={() => setMode("login")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default AuthForm;