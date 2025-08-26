import { useState, useMemo } from "react";
import { Icons } from "../constants/icons";
import { motion } from "framer-motion";

function OpenDocs({ docSelecionado, setDocSelecionado, onClose, tags, onVoltar }) {
  const [json, setJson] = useState(false);
  const [expandir, setExpandir] = useState(false);

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

  const { name, model, templateName } = docSelecionado;

  return (
    <motion.div
      className="edit-content"
      animate={{ width: expandir ? "100%" : "50%" }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="open-docs-bar"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex-left-right">
          <button
            className="action-big-btns"
            onClick={() => setExpandir(!expandir)}
          >
            <Icons.Expandir size={15} className="icons" />
            {!expandir ? "Expandir" : "Reduzir"}
          </button>

          <button className="action-big-btns" onClick={() => setJson(!json)}>
            <Icons.Lamp size={15} className="icons" />
            Modo de exibição:
            <b className="controle" style={{ marginLeft: "10px" }}>
              {json ? "Tags" : "Json"}
            </b>
          </button>
        </div>

        <Icons.Close
          size={20}
          className="icons"
          onClick={() => (onClose(), onVoltar(), setDocSelecionado(null))}
        />
      </div>

      <div className="open-edit-container">
        <div className="doc-title">
          <h2>
            {templateName ? templateName : name}
          </h2>
        </div>

        {json ? (
          <pre>{JSON.stringify(docSelecionado, null, 2)}</pre>
        ) : (
          tags.map((tag) => (
            <div className="flex-left-right" key={tag.id}>
              <h3 className="open-docs-tags">{tag.name}:</h3>
              <div
                className="results"
                style={{ backgroundColor: tagColors[tag.id] }}
              >
                <h3>{tag.value || "Não encontrado"}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default OpenDocs;
