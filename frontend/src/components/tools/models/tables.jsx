import { Icons } from "../../../constants/icons";
import axios from "axios";

const Tables = ({
  activeTab,
  modelos,
  tags,
  pastas,
  onEdit,
  showAlert,
}) => {
  const renderHeader = (title, btnLabel, type) => (
    <div className="table-header-actions">
      <h2>{title}</h2>
      <button className="btn-primary" onClick={() => onEdit(type, null)}>
        <Icons.Add size={16} /> {btnLabel}
      </button>
    </div>
  );

  // --- TABELA DE MODELOS ---
  if (activeTab === "Modelos") {
    return (
      <div className="table-container">
        {renderHeader("Modelos de Documento", "Novo Modelo", "modelo")}
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {modelos.map((m) => (
              <tr
                key={m.id}
                onClick={(prev) => !onEdit("modelo", m)}
                className="clickable-row"
              >
                <td>{m.name}</td>
                <td>{m.description || "-"}</td>
                <td>
                  <span className="tag-count">{m.tagsBase?.length || 0}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // --- TABELA DE TAGS ---
  if (activeTab === "Tags") {
    return (
      <div className="table-container">
        {renderHeader("Biblioteca de Tags", "Nova Tag", "tag")}
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome da Tag</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Exibição</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((t) => {
              const IconComponent = t.icon ? Icons[t.icon] : null;
              return (
                <tr
                  key={t.id}
                  onClick={() => onEdit("tag", t)}
                  className="clickable-row"
                >
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={14}
                          style={{ color: "var(--color-text-secondary)" }}
                        />
                      )}
                      {t.name}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`tag-type-badge type--${t.type?.toLowerCase()}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td>{t.category || "-"}</td>
                  <td>{t.displayCategory || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // --- TABELA DE PASTAS ---
  if (activeTab === "Pastas") {
    return (
      <div className="table-container" style={{ marginBottom: "2rem" }}>
        {renderHeader("Estrutura de Pastas", "Nova Pasta", "pasta")}
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome da Pasta</th>
            </tr>
          </thead>
          <tbody>
            {pastas.map((p) => (
              <tr
                key={p.id}
                onClick={() => onEdit("pasta", p)}
                className="clickable-row"
              >
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Icons.Folder
                      size={18}
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                    {p.name}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default Tables;
