import { useState , useEffect } from "react";
import { Icons } from "../constants/icons";
import { TAGS } from "../constants/constants";
function AlterNameWithTags({ selectedTags, selectedModel, setFileName }) {
  const [inputValue, setInputValue] = useState("");

  // sempre que inputValue mudar, sincroniza com o pai
  useEffect(() => {
    setFileName(inputValue);
  }, [inputValue, setFileName]);

  const tagsSelecionadas = TAGS.todasTags.filter((tag) =>
    selectedTags.includes(tag.id)
  );

  const adicionarTagNoInput = (tagContent) => {
    setInputValue((prev) =>
      prev ? `${prev} {${tagContent}}` : `{${tagContent}}`
    );
  };

  return (
    <div className="alterName-container" style={{ marginTop: 10 }}>
      <div className="tags-input , flex-down-top">
        <input
          type="text"
          placeholder="Digite o nome ou clique nas tags..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <div className="tags-list">
          {selectedModel?.name && (
            <span
              className="tag"
              onClick={() => adicionarTagNoInput(selectedModel.name)}
            >
              {selectedModel.name} <Icons.Add size={15} />
            </span>
          )}
          {tagsSelecionadas.map((tag) => (
            <span
              key={tag.id}
              className="tag"
              onClick={() => adicionarTagNoInput(tag.content)}
            >
              {tag.content} <Icons.Add size={15} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlterNameWithTags;
