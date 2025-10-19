import { useState, useMemo } from "react";
import { Icons } from "../../constants/icons";
import "./auth.css";

// Componentes reutilizáveis (assumindo que estão no mesmo escopo ou importados)
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
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <AuthHeader title="Crie sua Conta" subtitle="Comece a organizar seus documentos hoje." />

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
        label="Endereço de Email"
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
        placeholder="Mínimo 6 caracteres"
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
        placeholder="Repita a senha"
      />

      {!match && confirm.length > 0 && (
        <small className="hint error">As senhas não conferem.</small>
      )}

      <div className="auth-actions">
        <button type="submit" className="auth-btn" disabled={!canSubmit}>
          {loading ? "Cadastrando..." : "Criar Conta"}
        </button>
      </div>


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