import { MdOutlineEditNote } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoGlasses } from "react-icons/io5";
import { BiExpandAlt } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function OpenDocs({
  onClose,
  resultados,
  selectedTags,
  selectedModel,
  tagsUniversais,
  tagsParecer,
  tagsPrograma,
  tagsIA,
}) {
  //função de cores aleatórias... embaralhamento

  //receber os dados: modelId, nome do arquivo (modelId e número do processo / ou empresa)
  const todasTags = [
    ...tagsUniversais,
    ...tagsParecer,
    ...tagsPrograma,
    ...tagsIA,
  ];

  console.log(selectedModel);
  console.log(selectedTags);
  console.log(todasTags);

  const tags = todasTags.filter((tag) => selectedTags.includes(tag.id));

  return (
    <div className="edit-content">
      <div
        className="open-docs-bar"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex-left-right">
          <button className="action-big-btns">
            <BiExpandAlt size={10} className="icons" />
            <h3>Expandir</h3>
          </button>
          <button className="action-big-btns">
            <IoGlasses size={10} className="icons" />
            <h3>Alterar exibição</h3>
          </button>
        </div>

        <IoMdClose size={20} className="icons" onClick={onClose} />
      </div>

      <div
        className="open-edit-container"
      >
        <div className="doc-title">
          <h2>{selectedModel} n processo</h2>
        </div>

        {tags.map((tag) => (
          <div className="flex-left-right">
            <h3 className="open-docs-tags">{tag.content}:</h3>
            <div className="results">
              <h3>{resultados[tag.content]}</h3>
            </div>
          </div>
        ))}

        <pre
          style={{
            background: "#f4f4f4",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {JSON.stringify(resultados, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default OpenDocs;
