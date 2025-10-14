import "./EditModels.css";
import { Icons } from "../../../constants/icons";

// --- Dados Mockados (Mantidos como no original) ---
const analyticsMock = {
  tagsByType: { Regex: 12, "Inteligência Artificial": 8, Manual: 20 },
  tagsByCategory: { Segurança: 10, Compliance: 15, Infraestrutura: 5 },
  modelsWithTags: 7,
  totalModels: 10,
};

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
                style={{ height: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-chart__label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Componente Principal do Arquivo ---
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

export default Dashboard;