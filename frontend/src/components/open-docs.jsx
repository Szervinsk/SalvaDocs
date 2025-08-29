import { useState, useMemo } from "react";
import axios from "axios";
import { Icons } from "../constants/icons";
import { OPEN_OPTIONS } from "../constants/constants";
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
  const [json, setJson] = useState(false);

  // Gerador de cor
  const RandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.random() * 20;
    const lightness = 70 + Math.random() * 10;
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
              <button
                key={option.id}
                className="action-btns"
                onClick={() => handleOptionClick(option)}
              >
                {Icon && <Icon size={20} />}
              </button>
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

            {/* titulo dessa porra */}
            {tags
              .filter((tag) => tag.name === "Título")
              .map((tag) => (
                <h2 className="copy" key={tag.id}>
                  {tag.value}
                </h2>
              ))}
          </div>

          <div className="open-docs-content-main">
            {/* paragrafoooo */}
            <p>
              {tags
                .filter((tag) => tag.name === "Resumo")
                .map((tag) => (
                  <p className="copy" key={tag.id}>
                    {tag.value}
                  </p>
                ))}
            </p>
          </div>
        </div>

        <div className="open-docs-data">
          <header className="flex-left-right spc-bet">
            <div className="flex-left-right">
              <Icons.Tags size={15} className="icons" />
              <h3>Dados do Documento</h3>
            </div>

            <div>
              <button className="btn-toggle" onClick={() => setJson(!json)}>
                {json ? "json" : "tags"}
              </button>
            </div>
          </header>

          <div className="open-docs-data-content">
            {json ? (
              <pre className="div-json">
                {JSON.stringify(docSelecionado, null, 2)}
              </pre>
            ) : (
              <div className="div-tags">
                {tags
                  .filter(
                    (tag) => tag.name !== "Título" && tag.name !== "Resumo"
                  )
                  .map((tag) => {
                    const Icon = Icons[tag.icon];
                    return (
                      <div className="flex-left-right" key={tag.id}>
                        {Icon && <Icon size={15} className="icons" />}
                        <h3 className="open-docs-tags">{tag.name}:</h3>
                        <div
                          className="results"
                          style={{ backgroundColor: tagColors[tag.id] }}
                        >
                          <h3>{tag.value || "Não encontrado"}</h3>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
            <hr />

            <div className="open-docs-data-feedback">
              <div className="flex-left-right">
                <Icons.Graphics size={15} className="icons" />
                <h3>Feedback sobre a coleta dos dados</h3>
              </div>

              <Graphics
                docSelecionado={docSelecionado}
                setDocSelecionado={setDocSelecionado}
                onClose={onClose}
                tags={tags}
                onVoltar={onVoltar}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OpenDocs;
