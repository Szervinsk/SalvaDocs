import "./EditModels.css";
import { Icons } from "../../../constants/icons";
import { useMemo } from "react";

// ==========================================================================
// COMPONENTES REUTILIZÁVEIS DE VISUALIZAÇÃO
// ==========================================================================

// --- Card de Estatística ---
const StatCard = ({ icon, value, label, setArea }) => (
  <div className="stat-card" onClick={()=> setArea(label)}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__info">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  </div>
);

// --- Gráfico de Barras ---
const BarChart = ({ title, data }) => {
  const maxValue = useMemo(() => Math.max(...data.map((i) => i.value)) || 1, [data]);
  const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc949"];

  return (
    <div className="chart-card chart-bar">
      <h4>{title}</h4>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={item.label} className="bar-chart__item">
            <h5>{item.value}</h5>
            <div
              className="bar-chart__bar"
              style={{
                height: `${(item.value / maxValue) * 100}px`,
                backgroundColor: COLORS[index % COLORS.length],
              }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="bar-chart__label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Gráfico de Pizza ---
const PieChart = ({ title, data }) => {
  const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="chart-card chart-pie">
      <h4>{title}</h4>
      <div className="pie-chart-container">
        <svg viewBox="0 0 36 36" className="pie-chart">
          {data.map((item, index) => {
            const percent = total > 0 ? (item.value / total) * 100 : 0;
            const offset = cumulativePercent;
            cumulativePercent += percent;

            return (
              <circle
                key={item.label}
                r="14"
                cx="18"
                cy="18"
                fill="none"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth="5"
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div className="legend-list">
          {data.map((item, index) => (
            <div key={item.label} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL DO DASHBOARD
// ==========================================================================
const Dashboard = ({ tags, modelos, documentos, setArea }) => {
  const chartData = useMemo(() => {
    const tagsPerModel = modelos
      .map((modelo) => ({
        label: modelo.name,
        value: modelo.tagsBase?.length || 0,
      }))
      .sort((a, b) => b.value - a.value);

    const tagsByType = [
      { label: "Ia", value: tags.filter((t) => t.type === "IA").length },
      { label: "Regex", value: tags.filter((t) => t.type === "Regex").length },
    ].filter((item) => item.value > 0);

    return { tagsPerModel, tagsByType };
  }, [tags, modelos]);

  return (
    <div className="dashboard-grid">
      <div className="charts-row">
        <StatCard icon={<Icons.DocumentText />} value={documentos.length} label="Documentos" setArea={setArea}/>
        <StatCard icon={<Icons.Model />} value={modelos.length} label="Modelos" setArea={setArea} />
        <StatCard icon={<Icons.Tags />} value={tags.length} label="Tags" setArea={setArea} />
      </div>

      <div className="charts-row">
        <BarChart title="Tags por Modelo" data={chartData.tagsPerModel} />
        <PieChart title="Distribuição de Tipos de Tags" data={chartData.tagsByType} />
      </div>
    </div>
  );
};

export default Dashboard;
