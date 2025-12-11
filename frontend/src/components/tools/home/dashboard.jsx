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

const PieChart = ({ title, data }) => {
  const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  
  // Garante que seja número para evitar erros de soma
  const total = data.reduce((s, i) => s + Number(i.value), 0);

  let accumulated = 0;

  return (
    <div className="chart-card chart-pie">
      <h4>{title}</h4>

      <div className="pie-chart-container">
        <svg viewBox="0 0 42 42" className="pie-chart">
          {/* Círculo base (fundo cinza do anel) */}
          <circle
            cx="21"
            cy="21"
            r={radius}
            fill="none"
            stroke="var(--color-border)" 
            strokeWidth="6"
          />

          {data.map((item, index) => {
            const percent = total > 0 ? item.value / total : 0;
            const strokeLength = percent * circumference;
            
            // CORREÇÃO 1: Offset negativo é mais preciso para empilhar sentido horário
            const offset = -(accumulated * circumference);

            // Atualiza o acumulado para o próximo item
            accumulated += percent;

            return (
              <circle
                key={item.label}
                cx="21"
                cy="21"
                r={radius}
                fill="none"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth="6"
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={offset}
                
                // CORREÇÃO 2: Use "butt". "round" cria sobreposição de cores nas pontas.
                strokeLinecap="butt" 
                
                transform="rotate(-90 21 21)"
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
      { label: "Manual", value: tags.filter((t) => t.type === "Manual").length},
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