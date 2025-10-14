import { useEffect, useState } from "react";
import { Icons } from "../../../../constants/icons";

function AlterNameWithTags({ selectedTags, selectedModel, setFileName, tags }) {
  const [inputValue, setInputValue] = useState("");

  // Efeito para atualizar o nome do arquivo no componente pai
  useEffect(() => {
    setFileName(inputValue);
  }, [inputValue, setFileName]);

  // CORREÇÃO: Filtra o array `tags` para encontrar os objetos
  // correspondentes aos IDs em `selectedTags`.
  const tagsSelecionadas = selectedTags;

  // Função para adicionar uma tag ao campo de input
  const adicionarTagAoInput = (tagName) => {
    const tagFormatada = `{${tagName}}`;
    // Adiciona com um espaço se o campo não estiver vazio
    setInputValue((prev) => (prev ? `${prev} ${tagFormatada}` : tagFormatada));
  };

  return (
    <div className="alterName-container">
      <input
        type="text"
        className="text-input"
        placeholder="Digite o nome ou clique nas tags..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="tag-list-sm">
        {/* Botão para adicionar o nome do modelo */}
        {selectedModel?.name && (
          <button className="tag-pill-sm" onClick={() => adicionarTagAoInput(selectedModel.name)}>
            {selectedModel.name} <Icons.Add size={12} />
          </button>
        )}

        {/* Botões para cada tag selecionada */}
        {tagsSelecionadas.map((tag) => (
          <button key={tag.id} className="tag-pill-sm" onClick={() => adicionarTagAoInput(tag.name)}>
            {tag.name} <Icons.Add size={12} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default AlterNameWithTags;