import { useState, useMemo } from "react";

function Cadastro({ onSubmit, err, loading, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [forWork, setForWork] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const passOk = password.length >= 6;
  const match = password && confirm && password === confirm;

  const canSubmit = useMemo(
    () => isValidEmail(email) && passOk && match && !loading,
    [email, passOk, match, loading]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) {
      setError("Preencha todos os campos corretamente");
      return;
    }
    try {
      await onSubmit({ name, email, password, forWork });
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
    }
  };

  return (
    <main className="fundo">
      {err && <p className="error">{err}</p>}

      <form
        className="fundo-content , auth-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1 className="nametag">Área de Cadastro</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label htmlFor="sign-name">Nome</label>
        <input
          id="sign-name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
          required
        />

        <label htmlFor="sign-email">Email</label>
        <input
          id="sign-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />

        <label htmlFor="sign-password">Senha</label>
        <div className="auth-input-group">
          <input
            id="sign-password"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            placeholder="mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            minLength={6}
          />
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setShowPass((s) => !s)}
          >
            {showPass ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <label htmlFor="sign-confirm">Confirme a senha</label>
        <div className="auth-input-group">
          <input
            id="sign-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="repita a senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="auth-input"
            required
            minLength={6}
          />
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setShowConfirm((s) => !s)}
          >
            {showConfirm ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={forWork}
            onChange={(e) => setForWork(e.target.checked)}
          />
          <span>Estou usando o software para meu trabalho</span>
        </label>

        {!match && confirm.length > 0 && (
          <small className="hint">As senhas não conferem.</small>
        )}

        <button type="submit" className="auth-btn" disabled={!canSubmit}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="auth-switch">
          Já tem conta?{" "}
          <button type="button" className="link-btn" onClick={switchToLogin}>
            Entrar
          </button>
        </p>
      </form>
    </main>
  );
}

export default Cadastro;
