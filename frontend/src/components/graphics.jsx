import React, { useMemo } from "react";
import "../styles/open-docs.css";

function Graphics({ tags }) {
  if (!tags || tags.length === 0) return <p>Nenhuma tag disponível.</p>;

  // Número de tags que possuem valor
  const tagsAchadas = tags.filter(
    (tag) => tag.value && tag.value !== "Não encontrado"
  ).length;
  const porcentagem = (tagsAchadas / tags.length) * 100;

  return (
    <>
      <div style={{ marginTop: 20 }}>
        <h3 className="open-docs-tags">Porcentagem de tags capturadas:</h3>

        <div className="div-porcentagem">
          <div className="barra-porcentagem-bg">
            <div
              className="barra-porcentagem"
              style={{ width: `${porcentagem.toFixed(2)}%` }}
            ></div>
          </div>
          <h4 style={{ marginTop: 5, textAlign: "right" }}>
            {tagsAchadas} / {tags.length} ({porcentagem.toFixed(2)}%)
          </h4>
        </div>
      </div>

      <div>
        <h3 className="open-docs-tags">Distribuição de tags</h3>
        <div
          className="div-porcentagem"
          style={{ display: "flex", gap: "10px" }}
        >
          {(() => {
            const counts = tags.reduce((acc, tag) => {
              if (!tag.type) return acc;
              acc[tag.type] = (acc[tag.type] || 0) + 1;
              return acc;
            }, {});

            const total = tags.length;

            // cores diferentes para cada type
            const colors = {
              regex: "#4caf50", // verde
              ia: "#2196f3", // azul
              manual: "#ff9800", // laranja
            };

            return Object.entries(counts).map(([type, count]) => {
              const widthPercent = (count / total) * 100;
              return (
                <div
                  key={type}
                  style={{
                    flex: widthPercent,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="barra-porcentagem"
                    style={{
                      width: "100%",
                      height: "6px",
                      backgroundColor: colors[type] || "#ccc",
                    }}
                  />
                  <small style={{ marginTop: 5 }}>
                    <h4>
                      {type}: {count}
                    </h4>
                  </small>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </>
  );
}

export default Graphics;
