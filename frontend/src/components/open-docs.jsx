import { useState, useMemo } from "react";
import axios from "axios";
import { Icons } from "../constants/icons";
import { OPEN_OPTIONS } from "../constants/constants";
import { motion } from "framer-motion";
import Graphics from "./graphics";
import "../styles/open-docs.css";

function OpenDocs({
  docSelecionado,
  setDocSelecionado,
  onClose,
  tags,
  onVoltar,
  showAlert,
  setIsResponse,
  setEtapaAtual,
  setDocumentos,
  setSelectedModel,
}) {
  const [links, setLinks] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState("tags"); // "tags" | "json" | "graphics"

  // Gerador de cor
  const RandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 80 + Math.random() * 20;
    const lightness = 50 + Math.random() * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Memoriza cores
  const tagColors = useMemo(() => {
    const colors = {};
    tags.forEach((tag) => {
      colors[tag.id] = RandomColor();
    });
    return colors;
  }, [tags]);

  if (!docSelecionado) return null;

  const { name, model, templateName } = docSelecionado;

  // 🔑 Aqui mapeamos cada ação pelo id (ou poderia ser pelo name)
  const handleOptionClick = async (option) => {
    switch (option.id) {
      case 1: // Voltar
        if (onVoltar) {
          onVoltar();
          setDocSelecionado(null);
          setSelectedModel(null);
        }
        break;
      case 2: // Compartilhar
        console.log("Compartilhar doc:", docSelecionado);
        alert("Compartilhar ainda não implementado 🚀");
        break;
      case 3: // Baixar
        console.log("Baixar doc:", docSelecionado.path);
        // Exemplo: abrir o PDF no navegador
        window.open(`http://localhost:3000/${docSelecionado.path}`, "_blank");
        break;
      case 4: // Excluir
        console.log("Excluir doc:", docSelecionado.id);
        if (!window.confirm("Tem certeza que deseja apagar este documento?"))
          return;

        try {
          const response = await axios.post(
            `http://localhost:5000/api/files/delete/${docSelecionado.id}`
          );

          setDocumentos((prev) =>
            prev.filter((d) => d.id !== docSelecionado.id)
          );
          setDocSelecionado(null);
          setSelectedModel(null);
          setIsResponse(false);
          setEtapaAtual(1);

          showAlert("success", "Documento apagado com sucesso!");
        } catch (error) {
          console.error("Erro ao apagar documento:", error);
          showAlert("error", "Erro ao apagar documento!");
        }
        break;
      default:
        console.warn("Ação não reconhecida:", option);
    }
  };

  return (
    <main className="open-docs-container">
      <div className="open-docs-bar">
        <div className="flex-left-right" style={{ gap: "20px" }}>
          {OPEN_OPTIONS.map((option) => {
            const Icon = Icons[option.icon];
            return (
              <>
                <button
                  key={option.id}
                  className="action-btns"
                  onClick={() => handleOptionClick(option)}
                >
                  {Icon && <Icon size={20} />}
                </button>
                <h3>{option.name}</h3>
              </>
            );
          })}
        </div>
        <div> eita </div>
      </div>

      {/* resto igual */}

      <div className="open-docs-slide">
        <div className="open-docs-content">
          <div className="doc-title">
            <div
              className="flex-left-right spc-bet"
              style={{
                margin: "20px 10px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div className="flex-left-right">
                <Icons.Calendar size={15} className="icons2" />
                <h3>{docSelecionado.uploadedAt.split("T")[0]}</h3>
              </div>
              <div className="flex-left-right">
                <Icons.Model size={15} className="icons2" />
                <h3>{model}</h3>
              </div>
            </div>

            <div className="eachTag">
              {tags
                .filter((tag) => tag.name === "Data")
                .map((tag) => (
                  <div className="flex-left-right" key={tag.id} style={{ width: "fit-content" }}>
                    <h3 className="tagName">{tag.name}:</h3>
                    <h3 className="copy">{tag.value}</h3>
                  </div>
                ))}
            </div>

            {/* titulo dessa porra */}
            <div className="eachTag">
              {tags
                .filter(
                  (tag) =>
                    tag.name === "Título" || tag.name === "Título Parecer"
                )
                .map((tag) => (
                  <>
                    <h2 className="tagName">{tag.name}:</h2>

                    <h1 className="title , copy" key={tag.id}>
                      {tag.value}
                    </h1>
                  </>
                ))}
            </div>
          </div>

          <div className="open-docs-content-main">
            {/* paragrafoooo */}
            <p>
              {tags
                .filter(
                  (tag) =>
                    tag.name === "Resumo" || tag.name === "Resumo Parecer"
                )
                .map((tag) => (
                  <>
                  <b className="tagName">{tag.name}: </b>
                  <p className="copy" key={tag.id}>
                    {tag.value}
                  </p>
                  </>
                ))}
            </p>

            <div className="files-area">
              <div className="flex-left-right spc-bet">
                <h2>Links</h2>

                {!links ? (
                  <Icons.ArrowDown
                    size={20}
                    className="icons"
                    onClick={() => setLinks(!links)}
                  />
                ) : (
                  <Icons.ArrowUp
                    size={20}
                    className="icons"
                    onClick={() => setLinks(!links)}
                  />
                )}
              </div>

              {links && (
                <div className="file">
                  <h3>{docSelecionado.name}</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        <motion.div
          className={`open-docs-data ${collapsed ? "collapsed" : ""}`}
          animate={{ width: collapsed ? 80 : 300 }}
          transition={{ duration: 0.3 }}
        >
          <header
            style={{
              width: collapsed ? 60 : 260,
              height: "40px",
              borderBottom: "2px solid var(--border-color)",
              justifyContent: collapsed ? "center" : "space-between",
            }}
            className="flex-left-right spc-bet"
          >
            {!collapsed ? (
              <>
                <Icons.BackIn
                  size={30}
                  className="icons"
                  onClick={() => setCollapsed(!collapsed)}
                />
                <h3
                  className="switchs-data"
                  style={{
                    borderBottomColor:
                      viewMode === "tags" && "var(--second-color-blue)",
                  }}
                  onClick={() => setViewMode("tags")}
                >
                  Tags
                </h3>
                <h3
                  className="switchs-data"
                  style={{
                    borderBottomColor:
                      viewMode === "json" && "var(--second-color-blue)",
                  }}
                  onClick={() => setViewMode("json")}
                >
                  Json
                </h3>
                <h3
                  className="switchs-data"
                  style={{
                    borderBottomColor:
                      viewMode === "graphics" && "var(--second-color-blue)",
                  }}
                  onClick={() => setViewMode("graphics")}
                >
                  Gráficos
                </h3>
              </>
            ) : (
              <Icons.BackIn
                size={20}
                className="icons"
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </header>

          <div className="open-docs-data-content">
            {!collapsed && (
              <>
                {viewMode === "json" && (
                  <pre className="div-json">
                    {JSON.stringify(docSelecionado, null, 2)}
                  </pre>
                )}

                {viewMode === "tags" && (
                  <div className="div-tags">
                    {tags
                      .filter(
                        (tag) =>
                          tag.name !== "Título" &&
                          tag.name !== "Resumo" &&
                          tag.name !== "Resumo Parecer"
                      )
                      .map((tag) => {
                        const Icon = Icons[tag.icon];
                        return (
                          <div className="open-docs-tags" key={tag.id}>
                            {Icon && (
                              <Icon
                                size={15}
                                className="open-data-icons"
                                style={{ color: tagColors[tag.id] }}
                              />
                            )}
                            <h3 className="open-docs-tags">{tag.name}:</h3>
                            <div
                              className="results"
                              style={{ backgroundColor: tagColors[tag.id] }}
                            >
                              <h3 className="copy">
                                {tag.value || "Não encontrado"}
                              </h3>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {viewMode === "graphics" && (
                  <Graphics
                    docSelecionado={docSelecionado}
                    setDocSelecionado={setDocSelecionado}
                    onClose={onClose}
                    tags={tags}
                    onVoltar={onVoltar}
                  />
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default OpenDocs;
