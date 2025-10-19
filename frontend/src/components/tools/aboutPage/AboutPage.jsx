import { Icons } from "../../../constants/icons";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>Sobre o SalvaDocs</h1>
        <p>Analisador de documentos com IA integrada.</p>
      </header>

      <div className="about-content">
        <div className="about-card">
          <h3>O Projeto</h3>
          <p>
            O SalvaDocs foi criado para automatizar e otimizar o processo de leitura e extração de informações de documentos PDF. 
            Utilizando expressões regulares e o poder da IA generativa, a plataforma identifica e cataloga dados-chave, 
            organizando-os de forma inteligente para fácil acesso e gerenciamento.
          </p>
        </div>

        <div className="about-card">
          <h3>Tecnologias Utilizadas</h3>
          <ul className="tech-list">
            <li>React & Framer Motion</li>
            <li>Node.js & Express.js</li>
            <li>Sequelize (SQLite & PostgreSQL)</li>
            <li>Google Gemini API</li>
            <li>Autenticação com JWT</li>
          </ul>
        </div>

        <div className="about-card developer-card">
          <h3>Desenvolvedor</h3>
          <div className="developer-info">
            <span className="developer-name">Matheus Szervinsk</span>
            <a href="https://github.com/Szervinsk/SalvaDocs" target="_blank" rel="noopener noreferrer" className="github-link">
              <Icons.Code size={16} /> Ver Repositório no GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;