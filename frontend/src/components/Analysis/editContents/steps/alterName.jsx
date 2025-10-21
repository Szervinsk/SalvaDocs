import { useEffect, useState, useMemo, useRef } from "react";
import { Icons } from "../../../../constants/icons";

function AlterNameWithTags({ selectedTags, selectedModel, setFileName, tags }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null); // Ref para o campo de input

  // Efeito para atualizar o nome do arquivo no componente pai
  useEffect(() => {
    setFileName(inputValue);
  }, [inputValue, setFileName]);

  // Filtra o array `tags` para encontrar os objetos
  // correspondentes aos IDs em `selectedTags`. (Sua lógica estava correta)
  const selectedTagObjects = useMemo(() =>
    tags.filter(tag => selectedTags.includes(tag.id)),
    [tags, selectedTags]
  );

  // Insere o texto (seja nome do modelo or placeholder da tag) 
  // na posição atual do cursor no input.
  const handlePillClick = (textToInsert) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart; // Posição inicial do cursor
    const end = input.selectionEnd; // Posição final (caso algo esteja selecionado)
    const text = input.value;

    // Constrói a nova string com o texto inserido
    const newValue = text.substring(0, start) + textToInsert + text.substring(end);
    setInputValue(newValue);

    // Foca no input novamente e coloca o cursor logo após o texto inserido
    input.focus();
    // Usa setTimeout para garantir que o cursor seja movido após o React atualizar o DOM
    setTimeout(() => {
      const newCursorPosition = start + textToInsert.length;
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <div className="alter-name-container">
      <input
        type="text"
        name="alterName"
        ref={inputRef} // Adiciona a ref ao input
        className="filename-input"
        placeholder="Digite o nome ou clique nas tags abaixo..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="tag-pills-list">
        {/* Botão para adicionar o nome do modelo */}
        {selectedModel?.name && (
          <button
            type="button"
            className="tag-pill-sm"
            onClick={() => handlePillClick(selectedModel.name)}
          >
            <Icons.Model size={12} /> {selectedModel.name}
          </button>
        )}

        {/* Botões para cada tag selecionada */}
        {selectedTagObjects.map((tag) => {
          const IconComponent = Icons[tag.icon] || Icons.Tags;
          return (
            <button
              key={tag.id}
              type="button"
              className="tag-pill-sm"
              // Adiciona o placeholder com chaves {}
              onClick={() => handlePillClick(`{${tag.name}}`)}
            >
              <IconComponent size={12} /> {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AlterNameWithTags;