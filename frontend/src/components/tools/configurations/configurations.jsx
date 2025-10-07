import { useEffect, useState } from "react";
import { Icons } from "../../../constants/icons"; // Certifique-se que o caminho dos ícones está correto
import "./configurations.css";

function Configurations({ setDarkMode, darkMode, setPastasAbertas, pastasAbertas }) {
  // O estado da fonte foi movido para cá, pois é uma configuração local desta página
  const [fontSize, setFontSize] = useState("16px");

  // Carregar preferências salvas ao iniciar
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    const savedFont = localStorage.getItem("fontSize") || "16px";
    
    setDarkMode(savedMode);
    setFontSize(savedFont);

    document.documentElement.classList.toggle("dark", savedMode);
    document.documentElement.style.setProperty("--font-size-base", savedFont); // Alvo na variável base
  }, [setDarkMode]);

  // Salva e aplica dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Salva e aplica tamanho da fonte
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    document.documentElement.style.setProperty("--font-size-base", fontSize); // Alvo na variável base
  }, [fontSize]);

  return (
    <div className="configurations-page">
      <header className="configurations-header">
        <h1>Configurações</h1>
        <p>Personalize a aparência e o comportamento do aplicativo.</p>
      </header>

      <div className="config-list">
        {/* Card de Interface */}
        <div className="config-card">
          <div className="config-card__info">
            <Icons.Interface size={20} />
            <div>
              <h3>Interface</h3>
              <p>Escolha entre o tema claro ou escuro.</p>
            </div>
          </div>
          <div className="config-card__control">
            <div className="segmented-control">
              <button
                className={`segmented-control__button ${!darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(false)}
              >
                <Icons.Sun size={16} /> Claro
              </button>
              <button
                className={`segmented-control__button ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(true)}
              >
                <Icons.Moon size={16} /> Escuro
              </button>
            </div>
          </div>
        </div>

        {/* Card de Fonte */}
        <div className="config-card">
          <div className="config-card__info">
            <Icons.FontSize size={20} />
            <div>
              <h3>Tamanho da Fonte</h3>
              <p>Ajuste o tamanho do texto principal do aplicativo.</p>
            </div>
          </div>
          <div className="config-card__control">
            <div className="segmented-control">
              <button
                className={`segmented-control__button ${fontSize === "14px" ? "active" : ""}`}
                onClick={() => setFontSize("14px")}
              >
                Pequena
              </button>
              <button
                className={`segmented-control__button ${fontSize === "16px" ? "active" : ""}`}
                onClick={() => setFontSize("16px")}
              >
                Média
              </button>
              <button
                className={`segmented-control__button ${fontSize === "18px" ? "active" : ""}`}
                onClick={() => setFontSize("18px")}
              >
                Grande
              </button>
            </div>
          </div>
        </div>

        {/* Card de Layout */}
        <div className="config-card">
          <div className="config-card__info">
            <Icons.Layout size={20} />
            <div>
              <h3>Painel de Pastas</h3>
              <p>Exibir ou ocultar o painel lateral de pastas.</p>
            </div>
          </div>
          <div className="config-card__control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={pastasAbertas}
                onChange={() => setPastasAbertas(!pastasAbertas)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configurations;