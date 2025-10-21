import { useEffect, useState, useMemo } from "react";
import { Icons } from "../../../../constants/icons";

function AlterNameWithTags({ selectedTags, selectedModel, setFileName, tags }) {
  const [inputValue, setInputValue] = useState("");

  // Efeito para atualizar o nome do arquivo no componente pai sempre que o input mudar
  useEffect(() => {
    setFileName(inputValue);
  }, [inputValue, setFileName]);

  // Filtra o array `tags` (que contém todos os objetos de tag) para encontrar
  // apenas aqueles cujos IDs estão presentes no array `selectedTags`.
  const selectedTagObjects = useMemo(() =>
    tags.filter(tag => selectedTags.includes(tag.id)),
    [tags, selectedTags]
  );

  // Função para adicionar um placeholder de tag ao campo de input
  const handlePillClick = (tagName) => {
    const tagPlaceholder = `{${tagName}}`;
    // Adiciona com um espaço se o campo não estiver vazio
    setInputValue((prev) => (prev ? `${prev} ${tagPlaceholder}` : tagPlaceholder));
  };

  return (
    <div className="alter-name-container">
      <input
        type="text"
        name="alterName"
        className="filename-input"
        placeholder="Digite o nome ou clique nas tags abaixo..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="tag-pills-list">
        {/* Botão para adicionar o nome do modelo */}
        {selectedModel?.name && (
          <button type="button" className="tag-pill-sm" onClick={() => handlePillClick(selectedModel.name)}>
            <Icons.Model size={12} /> {selectedModel.name}
          </button>
        )}

        {/* Botões para cada tag selecionada */}
        {selectedTagObjects.map((tag) => {
          const IconComponent = Icons[tag.icon] || Icons.Tags;
          return (
            <button key={tag.id} type="button" className="tag-pill-sm" onClick={() => handlePillClick(tag.name)}>
              <IconComponent size={12} /> {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AlterNameWithTags;