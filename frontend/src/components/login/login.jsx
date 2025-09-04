import { useState } from "react";

function Login({ onSubmit, err, loading, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const canSubmit = isValidEmail(email) && password.length >= 6 && !loading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ email, password });
  };

  return (
    <main className="fundo">

      <form
        className="fundo-content auth-card"
        onSubmit={handleSubmit}
        noValidate
        >
        <h1 className="nametag">Área de login</h1>
        {err && <p className="error">{err}</p>}
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />

        <label htmlFor="login-password">Senha</label>
        <div className="auth-input-group">
          <input
            id="login-password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
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

        <button type="submit" className="auth-btn" disabled={!canSubmit}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-switch">
          Não tem conta?{" "}
          <button type="button" className="link-btn" onClick={switchToSignup}>
            Cadastre-se
          </button>
        </p>
      </form>
    </main>
  );
}

export default Login;
