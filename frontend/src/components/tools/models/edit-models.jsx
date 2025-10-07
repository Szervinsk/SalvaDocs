import "./models.css"; // Renomeie seu CSS para corresponder
import { useState } from "react";
import { Icons } from "../../../constants/icons";

// --- Dados Mockados (Mantidos como no original) ---
const analyticsMock = {
  tagsByType: { Regex: 12, "Inteligência Artificial": 8, Manual: 20 },
  tagsByCategory: { Segurança: 10, Compliance: 15, Infraestrutura: 5 },
  modelsWithTags: 7,
  totalModels: 10,
};

// ==========================================================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================================================

// --- Controle de Abas Genérico ---
const SegmentedControl = ({ options, activeOption, onSelect }) => (
  <div className="segmented-control">
    {options.map((option) => (
      <button
        key={option.value}
        className={`segmented-control__button ${activeOption === option.value ? "active" : ""}`}
        onClick={() => onSelect(option.value)}
      >
        {option.icon}
        {option.label}
      </button>
    ))}
  </div>
);

// --- Card de Estatística ---
const StatCard = ({ icon, value, label }) => (
  <div className="stat-card">
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__info">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  </div>
);

// --- Gráfico de Barras Simples ---
const BarChart = ({ title, data }) => {
  const maxValue = Math.max(...Object.values(data));
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div className="bar-chart">
        {Object.entries(data).map(([label, value]) => (
          <div key={label} className="bar-chart__item">
            <div className="bar-chart__bar-wrapper" title={`${label}: ${value}`}>
              <div
                className="bar-chart__bar"
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
            </div>
            <span className="bar-chart__label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================================================
// SUB-COMPONENTES DE VISUALIZAÇÃO (ÁREAS)
// ==========================================================================

// --- Dashboard ---
const Dashboard = ({ tags, modelos }) => {
  const modelCoverage = ((analyticsMock.modelsWithTags / analyticsMock.totalModels) * 100).toFixed(0);
  
  return (
    <div className="dashboard-grid">
      <StatCard icon={<Icons.Tags />} value={tags.length} label="Tags Cadastradas" />
      <StatCard icon={<Icons.Model />} value={modelos.length} label="Modelos Ativos" />
      <StatCard icon={<Icons.Check />} value={`${modelCoverage}%`} label="Modelos com Tags" />
      <BarChart title="Tags por Tipo" data={analyticsMock.tagsByType} />
      <BarChart title="Tags por Categoria" data={analyticsMock.tagsByCategory} />
    </div>
  );
};

// --- Lista de Tags ---
const TagsList = ({ tags }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th>Nome da Tag</th>
          <th>Categoria</th>
          <th>Tipo</th>
          <th>Ícone</th>
        </tr>
      </thead>
      <tbody>
        {tags.map((tag, index) => {
          const IconComponent = tag.icon ? Icons[tag.icon] : null;
          return (
            <tr key={index}>
              <td>{tag.name}</td>
              <td>{tag.category || "-"}</td>
              <td>{tag.type || "-"}</td>
              <td>{IconComponent && <IconComponent size={18} />}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// --- Gerenciamento de Modelos ---
const ModelsManager = ({ modelos }) => {
  const [modoModel, setModoModel] = useState("view");
  const modelOptions = [
    { label: "Visualizar", value: "view" },
    { label: "Editar", value: "edit" },
    { label: "Criar Novo", value: "create" },
  ];

  return (
    <div className="models-manager">
      <SegmentedControl options={modelOptions} activeOption={modoModel} onSelect={setModoModel} />
      <div className="models-manager__content">
        {modoModel === "view" && (
          <ul className="models-list-display">
            {modelos.map((modelo, idx) => (
              <li key={idx}><Icons.Model size={16}/> {modelo.name}</li>
            ))}
          </ul>
        )}
        {modoModel === "edit" && <p>Interface de edição de modelos aqui.</p>}
        {modoModel === "create" && <p>Interface de criação de modelos aqui.</p>}
      </div>
    </div>
  );
};


// ==========================================================================
// COMPONENTE PRINCIPAL
// ==========================================================================
function EditModels({ modelos, tags }) {
  const [area, setArea] = useState("dashboard"); // 'dashboard', 'models', 'tags'

  const areaOptions = [
    { label: "Dashboard", value: "dashboard", icon: <Icons.Graphics size={16} /> },
    { label: "Modelos", value: "models", icon: <Icons.Model size={16} /> },
    { label: "Tags", value: "tags", icon: <Icons.Tags size={16} /> },
  ];

  const renderArea = () => {
    switch (area) {
      case "tags":
        return <TagsList tags={tags} />;
      case "models":
        return <ModelsManager modelos={modelos} />;
      case "dashboard":
      default:
        return <Dashboard tags={tags} modelos={modelos} />;
    }
  };

  return (
    <main className="models-page">
      <header className="models-page__header">
        <h1>Painel de Modelos e Tags</h1>
        <p>Gerencie, visualize e analise seus modelos de extração e tags associadas.</p>
      </header>

      <div className="models-page__tabs">
        <SegmentedControl options={areaOptions} activeOption={area} onSelect={setArea} />
      </div>

      <div className="models-page__content">
        {renderArea()}
      </div>
    </main>
  );
}

export default EditModels;