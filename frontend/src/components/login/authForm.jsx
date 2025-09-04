import { useState, useEffect } from "react";
import Login from "./login";
import Cadastro from "./sign";
import "../../styles/logins.css";

function AuthForm({ isLogged, setIsLogged, user, setUser }) {
  const [mode, setMode] = useState("login"); // 'login' ou 'signup'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Função para buscar dados do usuário com token
  const fetchMe = async (accessToken) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include", // envia cookies se houver
      });

      if (!res.ok)
        throw new Error("Não foi possível obter os dados do usuário");

      const data = await res.json();
      return data; // { id, username, email }
    } catch (err) {
      console.error("Erro fetchMe:", err);
      return null;
    }
  };

  // Checa se já existe token no localStorage ao montar componente
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const userInfo = await fetchMe(token);
        if (userInfo) {
          setUser(userInfo);
          setIsLogged(true);
        } else {
          localStorage.removeItem("accessToken"); // token inválido
        }
      }
    };
    init();
  }, [setUser, setIsLogged]);

  // Login
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no login");

      // Salva token
      localStorage.setItem("accessToken", data.accessToken);

      // Usa diretamente o usuário que veio do backend
      setUser(data.user);
      setIsLogged(true);
    } catch (err) {
      console.error(err);
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const handleSignup = async ({ name, email, password, forWork }) => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, forWork }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");

      // Se o backend já retornar token no cadastro
      if (data.accessToken)
        localStorage.setItem("accessToken", data.accessToken);

      const token = data.accessToken || localStorage.getItem("accessToken");
      const userInfo = await fetchMe(token);
      setUser(userInfo || data.user);
      setIsLogged(true);
    } catch (err) {
      console.error(err);
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLogged) {
    return <h2>Bem-vindo, {user?.email || user?.username}!</h2>;
  }

  return mode === "login" ? (
    <Login
      onSubmit={handleLogin}
      loading={loading}
      err={err}
      switchToSignup={() => setMode("signup")}
    />
  ) : (
    <Cadastro
      onSubmit={handleSignup}
      err={err}
      loading={loading}
      switchToLogin={() => setMode("login")}
    />
  );
}

export default AuthForm;
