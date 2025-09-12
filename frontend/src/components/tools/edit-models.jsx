import "../../styles/models.css";
import { useState } from "react";
import { Icons } from "../../constants/icons";

// Exemplo de mock de dados analíticos (depois vc pode puxar do backend)
const analyticsMock = {
  tagsByType: {
    regex: 12,
    ia: 8,
    manual: 20,
  },
  tagsByCategory: {
    segurança: 10,
    compliance: 15,
    infraestrutura: 5,
  },
  modelsWithTags: 7,
  totalModels: 10,
};

function EditModels({ modelos, tags }) {
  const [area, setArea] = useState(3);
  const [modoModel, setModoModel] = useState("");

  // Função para calcular % de modelos com tags
  const getModelCoverage = () =>
    ((analyticsMock.modelsWithTags / analyticsMock.totalModels) * 100).toFixed(0);

  return (
    <main className="models-container">
      <header>
        <h1 className="title">Painel de Modelos e Tags</h1>
      </header>

      {/* --- DASHBOARD --- */}
      {area === 3 && (
        <div className="models-area dashboard">
          <h2>Visão Geral</h2>

          <div className="dashboard-cards">
            <div className="card">
              <Icons.Tags size={20} />
              <h3>{tags.length}</h3>
              <p>Tags cadastradas</p>
            </div>

            <div className="card">
              <Icons.Model size={20} />
              <h3>{modelos.length}</h3>
              <p>Modelos cadastrados</p>
            </div>

            <div className="card">
              <Icons.Check size={20} />
              <h3>{getModelCoverage()}%</h3>
              <p>Modelos com tags</p>
            </div>
          </div>

          <div className="charts-area">
            <div className="chart">
              <h3>Tags por Tipo</h3>
              <ul>
                {Object.entries(analyticsMock.tagsByType).map(([type, count]) => (
                  <li key={type}>
                    <b>{type}</b>: {count}
                  </li>
                ))}
              </ul>
            </div>

            <div className="chart">
              <h3>Tags por Categoria</h3>
              <ul>
                {Object.entries(analyticsMock.tagsByCategory).map(([cat, count]) => (
                  <li key={cat}>
                    <b>{cat}</b>: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- TOGGLE ÁREAS --- */}
      <div className="models-toggle-areas">
        <ul className="flex-left-right" style={{ listStyle: "none" }}>
          <li onClick={() => setArea(3)} className={area === 3 ? "active-tab" : ""}>
            <Icons.Business size={15} className="icons-r" />
            <h2>Dashboard</h2>
          </li>

          <li onClick={() => setArea(1)} className={area === 1 ? "active-tab" : ""}>
            <Icons.Model size={15} className="icons-r" />
            <h2>Modelos</h2>
          </li>

          <li onClick={() => setArea(2)} className={area === 2 ? "active-tab" : ""}>
            <Icons.Tags size={15} className="icons-r" />
            <h2>Tags</h2>
          </li>
        </ul>
      </div>

      {/* --- LISTA DE TAGS --- */}
      {area === 2 && (
        <div className="models-area">
          <h2>Lista de Tags</h2>
          <table className="tags-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Ícone</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{tag.name}</td>
                  <td>{tag.category || "-"}</td>
                  <td>{tag.type || "-"}</td>
                  <td>
                    {tag.icon ? (() => {
                      const IconComponent = Icons[tag.icon];
                      return IconComponent ? (
                        <IconComponent size={20} className="icons-pasta-dashboard" />
                      ) : null;
                    })() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- LISTA DE MODELOS --- */}
      {area === 1 && (
        <div className="models-area">
          <div className="toggle-switch-models-actions">
            <div className="models-toggle">
              <div
                className="toggle-bg"
                style={{
                  transform:
                    modoModel === "Visualizar modelos" ? "translateX(96%)" : "translateX(0)",
                }}
              />
              <label onClick={() => setModoModel("Visualizar modelos")}>
                <input type="radio" name="models" value="Visualizar modelos"
                  checked={modoModel === "Visualizar modelos"} readOnly style={{ display: "none" }} />
                Visualizar modelos
              </label>
              <label onClick={() => setModoModel("Editar Modelos")}>
                <input type="radio" name="models" value="Editar Modelos"
                  checked={modoModel === "Editar Modelos"} readOnly style={{ display: "none" }} />
                Editar modelos
              </label>
              <label onClick={() => setModoModel("Criar modelos")}>
                <input type="radio" name="models" value="Criar modelos"
                  checked={modoModel === "Criar modelos"} readOnly style={{ display: "none" }} />
                Criar modelos
              </label>
            </div>

            <h2>Modelos Cadastrados</h2>
            <ul className="models-list">
              {modelos.map((modelo, idx) => (
                <li key={idx}>Id: {idx} - {modelo.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}

export default EditModels;
