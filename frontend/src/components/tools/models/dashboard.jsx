import "./EditModels.css";
import { Icons } from "../../../constants/icons";
import { useMemo } from "react";
import { motion } from "framer-motion"; // Importado para animações

// ==========================================================================
// COMPONENTES REUTILIZÁVEIS DE VISUALIZAÇÃO
// ==========================================================================

// --- Card de Estatística ---
const StatCard = ({ icon, value, label, setArea }) => (
  // O card agora é um botão clicável que navega para a seção
  <button className="stat-card" onClick={() => setArea(label)}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__info">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  </button>
);

// --- Gráfico de Barras ---
const BarChart = ({ title, data, color }) => {
  const maxValue = useMemo(() => Math.max(...data.map(item => item.value)) || 1, [data]);
  const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc949"];

  return (
    <div className="chart-card chart-bar">
      <h4>{title}</h4>
      <div className="bar-chart">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={item.label} className="bar-chart__item">
              <h5 title={`${item.label}: ${item.value}`}>{item.value}</h5>
              <div
                className="bar-chart__bar-wrapper"
                title={`${item.label}: ${item.value}`}
              >
                <motion.div
                  className="bar-chart__bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / maxValue) * 100}px` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
              <span className="bar-chart__label">{item.label}</span>
            </div>
          ))
        ) : (
          <p className="empty-text">Sem dados para exibir.</p>
        )}
      </div>
    </div>
  );
};

// --- Gráfico de Pizza ---
const PieChart = ({ title, data }) => {
  const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  let cumulativePercent = 0;

  return (
    <div className="chart-card chart-pie">
      <h4>{title}</h4>
      <div className="pie-chart-container">
        <svg viewBox="0 0 42 42" className="pie-chart">
          {data.length > 0 ? (
            data.map((item, index) => {
              const percent = total > 0 ? (item.value / total) * 100 : 0;
              // Ajuste matemático para o offset
              const offset = 25 - cumulativePercent;
              cumulativePercent += percent;

              return (
                <circle
                  key={item.label}
                  className="pie-chart__slice"
                  r="4" // Raio para viewBox de 36
                  cx="18"
                  cy="18"
                  fill="none"
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth="2" // Largura da "borda"
                  strokeDasharray={`${percent} ${100 - percent}px`}
                  strokeDashoffset={offset} // Offset corrigido
                />
              );
            })
          ) : (
            // Círculo cinza se não houver dados
            <circle cx="9" cy="9" r="4" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
          )}
        </svg>
        <div className="legend-list">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={item.label} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))
          ) : (
            <p className="empty-text">Sem dados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL DO DASHBOARD
// ==========================================================================
const Dashboard = ({ tags, modelos, documentos, setArea, pastas }) => {
  const chartData = useMemo(() => {
    const tagsPerModel = modelos
      .map((modelo) => ({
        label: modelo.name,
        value: modelo.tagsBase?.length || 0,
      }))
      .sort((a, b) => b.value - a.value);

    const tagsByType = [
      { label: "IA", value: tags.filter((t) => t.type === "IA").length },
      { label: "Regex", value: tags.filter((t) => t.type === "Regex").length },
    ].filter((item) => item.value > 0);

    return { tagsPerModel, tagsByType };
  }, [tags, modelos]);

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="dashboard-grid"
    >

      <div className="stats-row">
        <StatCard icon={<Icons.DocumentText size={20}/>} value={documentos.length} label="Documentos" setArea={setArea} />
        <StatCard icon={<Icons.Model size={20} />} value={modelos.length} label="Modelos" setArea={setArea} />
        <StatCard icon={<Icons.Tags size={20}/>} value={tags.length} label="Tags" setArea={setArea} />
        <StatCard icon={<Icons.Folder size={20} />} value={pastas.length} label="Pastas" setArea={setArea} />
      </div>

      <div className="charts-row">
        <BarChart title="Tags por Modelo" data={chartData.tagsPerModel} />
        <PieChart title="Distribuição de Tipos de Tags" data={chartData.tagsByType} />
      </div>
    </motion.div>
  );
};

export default Dashboard;