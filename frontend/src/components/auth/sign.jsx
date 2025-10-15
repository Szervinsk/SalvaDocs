import { useState, useMemo } from "react";
import { Icons } from "../../constants/icons"

// Reutilizando os componentes do Login.jsx
const AuthHeader = ({ title, subtitle }) => (
  <header className="auth-header">
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

function Cadastro({ onSubmit, err, loading, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const passOk = password.length >= 6;
  const match = password === confirm;

  const canSubmit = useMemo(
    () => name && isValidEmail(email) && passOk && match && !loading,
    [name, email, passOk, match, loading]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onSubmit({ username: name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AuthHeader title="Crie sua conta" subtitle="Comece a organizar seus documentos hoje." />

      {err && <p className="auth-error">{err}</p>}

      <AuthInput
        id="signup-name"
        label="Nome Completo"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
      />
      <AuthInput
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
      />
      <AuthInput
        id="signup-password"
        label="Senha"
        type={showPass ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="mínimo 6 caracteres"
      >
        <button type="button" className="ghost-btn" onClick={() => setShowPass((s) => !s)}>
          {showPass ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
        </button>
      </AuthInput>
      <AuthInput
        id="signup-confirm"
        label="Confirme a Senha"
        type={showPass ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="repita a senha"
      />

      {!match && confirm.length > 0 && (
        <small className="hint error">As senhas não conferem.</small>
      )}

      <button type="submit" className="auth-btn" disabled={!canSubmit}>
        {loading ? "Cadastrando..." : "Criar Conta"}
      </button>

      <p className="auth-switch">
        Já tem uma conta?{" "}
        <button type="button" className="link-btn" onClick={switchToLogin}>
          Faça login
        </button>
      </p>
    </form>
  );
}

export default Cadastro;