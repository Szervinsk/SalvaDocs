import { useState, useMemo } from "react";
import { Icons } from "../constants/icons";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/open-docs.css";

function OpenDocs({
  docSelecionado,
  tags,
  onToggleExpand,
  isExpanded,
  barraLateral,
  setDocSelecionado,
  onVoltar,
  setDocumentos,
  setSelectedModel,
  setEtapaAtual,
  showAlert,
  setIsResponse,
  onClose
}) {
  const [viewMode, setViewMode] = useState("resumo"); // "resumo" | "json" | "docs"
  const [flexTag, setFlexTag] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const tagsTitulo = [
    "Título",
    "Resumo",
    "Resumo Parecer",
    "Documentos referenciados",
    "Título Parecer",
    "Assunto",
  ];

  const handleOptionClick = async (id) => {
    switch (id) {
      case 1: // Voltar
        if (onVoltar) {
          onVoltar();
        }
        // limpa estados
        setDocSelecionado(null);
        setSelectedModel(null);
        // fecha painel
        onClose(false);
        break;

      case 2: // Excluir
        if (!window.confirm("Tem certeza que deseja apagar este documento?"))
          return;

        try {
          const response = await axios.delete(
            `http://localhost:5000/api/files/documentos/${docSelecionado.id}`
          );

          if (response.status >= 200 && response.status < 300) {
            setDocumentos((prev) =>
              prev.filter((d) => d.id !== docSelecionado.id)
            );
            setDocSelecionado(null);
            setSelectedModel(null);
            setIsResponse(false);
            setEtapaAtual(false);
            showAlert(
              "success",
              response.data.message || "Documento apagado com sucesso!"
            );
            onVoltar();

          } else {
            showAlert("error", "Erro inesperado ao apagar documento");
          }
        } catch (error) {
          console.error("Erro ao apagar documento:", error);
          showAlert("error", "Erro ao apagar documento");
        }
        break;

      default:
        console.warn("Ação não reconhecida");
    }
  };

  // Gerador de cor (aleatório mas estável por render)
  const RandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 80 + Math.random() * 20;
    const lightness = 50 + Math.random() * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Memoriza cores por tag
  const tagColors = useMemo(() => {
    const colors = {};
    tags.forEach((tag) => {
      colors[tag.id] = RandomColor();
    });
    return colors;
  }, [tags]);

  // Conta docs uma única vez
  const howManyDocs = useMemo(() => {
    const docsTag = tags.find((t) => t.name === "Documentos referenciados");
    if (!docsTag) return 0;
    try {
      const parsed = JSON.parse(docsTag.value);
      return Array.isArray(parsed) ? parsed.length : 1;
    } catch {
      return docsTag.value ? 1 : 0;
    }
  }, [tags]);

  if (!docSelecionado) return null;

  return (
    <motion.div
      className={`lateral-bar ${barraLateral ? "reduzido" : ""} ${expanded ? "expanded" : ""}`}
      animate={{ width: expanded ? "100%" : barraLateral ? "40px" : "50%" }}
      transition={{ duration: 0.3 }}
    >

      {/* Cabeçalho */}
      <header className="lateral-bar-header">
        <div className="header" >
          <Icons.Close size={20} className="icons-r" onClick={() => handleOptionClick(1)} />

          <h3 className="italic">{docSelecionado.resolvedTemplate}</h3>
        </div>

        <div className="header">
          <Icons.Delete size={20} className="icons-r" onClick={() => handleOptionClick(2)} />
          <Icons.MdOutlineMoreHoriz size={20} className="icons-l" />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="open-docs-container">
        {/* Título do documento */}
        <section className="doc-title">
          {(() => {
            const priority = ["Título", "Assunto", "Título Parecer"];
            const tag = tags.find((t) => priority.includes(t.name));
            if (tag) {
              return (
                <>
                  <h2 className="tagName">{tag.name}:</h2>
                  <h1 className="title copy">{tag.value}</h1>
                </>
              );
            }
            return (
              <>
                <h2 className="tagName">Nome do arquivo:</h2>
                <h1 className="title copy">{docSelecionado.name}</h1>
              </>
            );
          })()}
        </section>

        {/* Tags */}
        <div className="tags-label">
          <h2 className="tagName" style={{ marginBottom: "5px" }}>Tags encontradas: </h2>
          <Icons.Layout size={15} onClick={() => setFlexTag(!flexTag)} />
        </div>

        <section className="tags-section" style={{ flexDirection: flexTag ? "column" : "row" }}>
          {tags
            .filter((tag) => !tagsTitulo.includes(tag.name))
            .map((tag) => {
              const Icon = Icons[tag.icon];
              return (
                <div className="open-docs-tags" key={tag.id} style={{ opacity: tag.value === "Não encontrado" ? 0.5 : 1 }}>
                  {Icon && <Icon size={15} className="open-data-icons" />}
                  <h3 className="open-docs-tag-name">{tag.name}:</h3>
                  <div
                    className="results"
                    style={{ backgroundColor: tagColors[tag.id] }}
                  >
                    <h3 className="copy">{tag.value || "Não encontrado"}</h3>
                  </div>
                </div>
              );
            })}
        </section>

        {/* Alternador */}
        <nav className="view-switch">
          <ul>
            <li
              className={viewMode === "resumo" ? "active" : ""}
              onClick={() => setViewMode("resumo")}
            >
              Resumo
            </li>
            <li
              className={viewMode === "docs" ? "active" : ""}
              onClick={() => setViewMode("docs")}
            >
              Documentos <span className="doc-count">{howManyDocs}</span>
            </li>
            <li
              className={viewMode === "json" ? "active" : ""}
              onClick={() => setViewMode("json")}
            >
              Json
            </li>
          </ul>
        </nav>

        {/* Conteúdo dinâmico */}
        <section className="open-docs-content-main">
          {viewMode === "resumo" && (
            <div className="div-resumo">
              {tags
                .filter((t) => ["Resumo", "Resumo Parecer"].includes(t.name))
                .map((t) => (
                  <p key={t.id} className="copy">{t.value}</p>
                ))}
            </div>
          )}

          {viewMode === "docs" && (
            <div className="files-area">
              {tags.filter((t) => t.name === "Documentos referenciados")
                .map((tag) => {
                  let docs = [];
                  try {
                    docs = JSON.parse(tag.value);
                  } catch {
                    docs = [tag.value];
                  }
                  return docs.map((doc, idx) => (
                    <div className="file" key={`${tag.id}-${idx}`}>
                      <Icons.DocumentText size={20} className="icons2" />
                      <h3>{doc}</h3>
                    </div>
                  ));
                })}
            </div>
          )}

          {viewMode === "json" && (
            <pre className="div-json">
              {JSON.stringify(docSelecionado, null, 2)}
            </pre>
          )}
        </section>
      </main>

      {/* Rodapé */}
      <footer className="lateral-bar-footer">
        <Icons.Expandir size={20} onClick={onToggleExpand} className="icons-l" />
        <h3>{isExpanded ? "Recolher" : "Expandir"}</h3>
      </footer>

    </motion.div>

  );
}

export default OpenDocs;
