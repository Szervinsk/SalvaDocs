import { useState, useMemo } from "react";
import { Icons } from "../constants/icons";
import "../styles/open-docs.css";

function OpenDocs({
  docSelecionado,
  setDocSelecionado,
  onClose,
  tags,
  onVoltar,
}) {
  const [json, setJson] = useState(false);

  // Função para gerar cor
  const RandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.random() * 20;
    const lightness = 70 + Math.random() * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Memoriza uma cor fixa para cada tag.id enquanto esse componente estiver montado
  const tagColors = useMemo(() => {
    const colors = {};
    tags.forEach((tag) => {
      colors[tag.id] = RandomColor();
    });
    return colors;
  }, [tags]);

  if (!docSelecionado) return null;

  const { name, model, templateName } = docSelecionado;

  return (
    <main className="open-docs-container">
      <div
        className="open-docs-bar"
        style={{ justifyContent: "space-between" }}
      >
        <button
          className="action-big-btns"
          style={{ width: "100px" }}
          onClick={() => onVoltar()}
        >
          Voltar
        </button>
        espaço pra sla oq
      </div>

      <div className="open-docs-slide">
        <div className="open-docs-content">
          <div className="doc-title">
            <div className="flex-left-right spc-bet" >
              <div className="flex-left-right">
                <Icons.Calendar size={15} />
                <h3>{docSelecionado.uploadedAt}</h3>
              </div>
              <div className="flex-left-right">
                <Icons.Model size={15} />
                <h3>{model}</h3>
              </div>
            </div>

            <h2>{templateName ? templateName : name}</h2>
          </div>

          <p>
            Aqui vai ficar os parágrafos muito grandes do texto para que fique
            legal e tals, aí vc vai poder ver algo dele né e tome le dale tuft
          </p>
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
              <div>
                {tags.map((tag) => {
                  const Icon = Icons[tag.icon];
                  return (
                    <div className="flex-left-right" key={tag.id}>
                      {Icon && <Icon size={15} className="icons" />}
                      <h3 className="open-docs-tags">{tag.content}:</h3>
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
              <h3>Feedback sobre a coleta dos dados</h3>

              <div>grafico</div>
              <div>quantidade de informações captadas</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OpenDocs;
