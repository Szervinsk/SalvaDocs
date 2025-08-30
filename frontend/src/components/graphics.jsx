import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../styles/open-docs.css";

function Graphics({ tags }) {
  // cálculo de porcentagem
  const tagsAchadas = tags.filter(
    (tag) => tag.value && tag.value !== "Não encontrado"
  ).length;
  const porcentagem = (tagsAchadas / tags.length) * 100;

  // calcular distribuição por type (hook no nível do componente)
  const distributionData = useMemo(() => {
    const counts = tags.reduce((acc, tag) => {
      if (!tag.type) return acc;
      acc[tag.type] = (acc[tag.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
    }));
  }, [tags]);

  const COLORS = {
    regex: "#4caf50", // verde
    ia: "#2196f3", // azul
    manual: "#ff9800", // laranja
  };

  if (!tags || tags.length === 0) return <p>Nenhuma tag disponível.</p>;
  return (
    <>
      <div style={{ marginTop: 20 }}>
        <h3 className="open-docs-tags">Porcentagem de tags capturadas:</h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={[{ name: "Tags", value: porcentagem }]}>
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
        <h4 style={{ marginTop: 5, textAlign: "right" }}>
          {tagsAchadas} / {tags.length} ({porcentagem.toFixed(2)}%)
        </h4>
      </div>

      <div>
        <h3 className="open-docs-tags">Distribuição de tags</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={distributionData}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {distributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.type] || "#ccc"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default Graphics;
