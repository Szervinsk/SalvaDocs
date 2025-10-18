import { useState } from "react";
import { Icons } from "../../constants/icons";

// Componentes reutilizáveis (podem ser movidos para um arquivo separado)
const AuthHeader = ({ title, subtitle }) => (
  <header className="auth-form__header">
    <h2>{title}</h2>
    <p>{subtitle}</p>
  </header>
);

const AuthInput = ({ id, label, type, value, onChange, placeholder, children }) => (
  <div className="input-wrapper">
    <label htmlFor={id}>{label}</label>
    <div className="input-group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="auth-input"
        required
      />
      {children}
    </div>
  </div>
);

function Login({ onSubmit, err, loading, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const canSubmit = isValidEmail(email) && password.length >= 6 && !loading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <AuthHeader title="Bem-vindo de volta!" subtitle="Faça login para acessar seu painel." />

      {err && <p className="auth-error">{err}</p>}

      <AuthInput
        id="login-email"
        label="Endereço de Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
      />

      <AuthInput
        id="login-password"
        label="Senha"
        type={showPass ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      >
        <button type="button" className="ghost-btn" onClick={() => setShowPass((s) => !s)}>
          {showPass ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
        </button>
      </AuthInput>

      <div className="auth-actions">
        <button type="button" className="link-btn">Esqueceu a senha?</button>
        <button type="submit" className="auth-btn" disabled={!canSubmit}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      <p className="auth-switch">
        Não tem uma conta?{" "}
        <button type="button" className="link-btn" onClick={switchToSignup}>
          Cadastre-se
        </button>
      </p>
    </form>
  );
}

export default Login;