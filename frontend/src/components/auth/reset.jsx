import { useState, useMemo } from "react";
import axios from "axios";
import { Icons } from "../../constants/icons";
import "./auth.css";

// Reutilizando header uniforme:
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

function ResetPassword({ loading, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const passOk = newPassword.length >= 6;
  const match = newPassword === confirm;

  const canSubmit = useMemo(
    () => email && passOk && match && !loading,
    [email, passOk, match, loading]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await axios.post("/auth/reset-password", { email, newPassword });
      setSuccess("Senha redefinida com sucesso! Faça login com sua nova senha.");
    } catch {
      setSuccess("");
      setError("Usuário não encontrado ou erro ao redefinir!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <AuthHeader
        title="Redefinir Senha"
        subtitle="Informe seu e-mail e digite sua nova senha."
      />

      {success && <p className="success">{success}</p>}
      {error && <p className="auth-error">{error}</p>}

      <AuthInput
        id="reset-email"
        label="Endereço de Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
      />

      <AuthInput
        id="reset-password"
        label="Nova Senha"
        type={showPass ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Mínimo 6 caracteres"
      >
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setShowPass((s) => !s)}
        >
          {showPass ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
        </button>
      </AuthInput>

      <AuthInput
        id="reset-confirm"
        label="Confirme a Nova Senha"
        type={showPass ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Repita a nova senha"
      />

      {!match && confirm.length > 0 && (
        <small className="hint error">As senhas não conferem.</small>
      )}

      <div className="auth-actions">
        <button type="submit" className="auth-btn" disabled={!canSubmit}>
          {loading ? "Salvando..." : "Salvar Nova Senha"}
        </button>
      </div>

      <p className="auth-switch">
        Lembrou a senha?{" "}
        <button type="button" className="link-btn" onClick={switchToLogin}>
          Fazer login
        </button>
      </p>
    </form>
  );
}

export default ResetPassword;
