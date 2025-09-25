import { useEffect, useState } from "react";
import "./configurations.css";

function Configurations({ setDarkMode, darkMode, barraLateral, setBarraLateral }) {
  const [fontSize, setFontSize] = useState("16px");

  // Carregar preferências salvas ao iniciar
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    const savedFont = localStorage.getItem("fontSize") || "16px";
    const savedSidebar = localStorage.getItem("barraLateral") !== "false";

    setDarkMode(savedMode);
    setFontSize(savedFont);
    setBarraLateral(savedSidebar);

    // Aplica globalmente
    document.documentElement.classList.toggle("dark", savedMode);
    document.documentElement.style.setProperty("--font-size", savedFont);
  }, []);

  // Atualiza dark mode global
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Atualiza fonte global
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    document.documentElement.style.setProperty("--font-size", fontSize);
  }, [fontSize]);

  // Barra lateral (opcional, depende da estrutura do app)
  useEffect(() => {
    localStorage.setItem("barraLateral", barraLateral);
  }, [barraLateral]);

  return (
    <div className="configurations-container">
      <h2>Configurações</h2>

      <div className="config-section">
        <h3>Interface</h3>
        <button className="config-btn" onClick={() => setDarkMode(false)}>Tema Claro</button>
        <button className="config-btn" onClick={() => setDarkMode(true)}>Tema Escuro</button>
      </div>

      <div className="config-section">
        <h3>Fonte</h3>
        <button className="config-btn" onClick={() => setFontSize("14px")}>Pequena</button>
        <button className="config-btn" onClick={() => setFontSize("16px")}>Média</button>
        <button className="config-btn" onClick={() => setFontSize("18px")}>Grande</button>
      </div>

      <div className="config-section">
        <h3>Layout</h3>
        <button className="config-btn" onClick={() => setBarraLateral(!barraLateral)}>
          {barraLateral ? "Ocultar Barra Lateral" : "Mostrar Barra Lateral"}
        </button>
      </div>
    </div>
  );
}

export default Configurations;
