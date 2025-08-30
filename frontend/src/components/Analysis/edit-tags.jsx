import SearchBar from "../bars/searchbar";
import { BLOCOS, TAGS } from "../../constants/constants";
import { Icons } from "../../constants/icons";
import { useState, useEffect } from "react";

function EditTags({
  etapas,
  etapaAtual,
  onClose,
  selectedModel,
  selectedTags,
  setSelectedTags,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [needTagInfo, setNeedTagInfo] = useState(false);
  const [openBlocks, setOpenBlocks] = useState(
    BLOCOS.reduce((acc, bloco) => {
      acc[bloco.key] = true; // todos começam abertos
      return acc;
    }, {})
  );

  const blocos = BLOCOS;

  // Pré-seleção de acordo com o modelo
  useEffect(() => {
    const mapaPreSelecao = {
      Despacho: [...TAGS.universais, ...TAGS.ia],
      Parecer: [...TAGS.universais, ...TAGS.parecer, ...TAGS.ia],
      Programas: [...TAGS.universais, ...TAGS.programa, ...TAGS.ia],
    };

    const chave = selectedModel?.name;
    const tagsModelo = mapaPreSelecao[chave] || [];

    // Sempre redefine quando mudar de modelo
    setSelectedTags(tagsModelo.map((tag) => tag.id));
  }, [selectedModel, setSelectedTags]);

  const handleChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Função para filtrar tags pela busca
  const filterTags = (tagsList) => {
    if (!searchQuery) return tagsList;
    return tagsList.filter((tag) =>
      tag.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="edit-content">
      {/* HEADER */}
      <header className="flex-left-right spc-bet">
        <div className="flex-left-right">
          <Icons.EditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <Icons.Close size={20} className="icons" onClick={onClose} />
      </header>

      {/* DESCRIÇÃO */}
      <p className="edit-p">
        Você selecionou o modelo <b>{selectedModel?.name}</b>. Isso significa
        que já existem <b>tags pré-configuradas</b> para esse tipo de documento.
        Mesmo assim, você pode ajustar os critérios de captura conforme desejar
        antes de iniciar o processo.
      </p>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={"Buscar tags..."}
      />

      {/* BLOCOS DE TAGS */}
      {blocos.map(({ key, title, data, color, info }) => {
        const filtradas = filterTags(data);

        return (
          <div
            key={key}
            className="tags-block"
            style={{ borderColor: color }} // borda do bloco
          >
            {/* TOGGLE HEADER */}
            <div
              className="tags-block-header"
              style={{ backgroundColor: color }}
              onClick={() =>
                setOpenBlocks((prev) => ({ ...prev, [key]: !prev[key] }))
              }
            >
              <h3 style={{ color: "var(--white)" }}>{title}</h3>

              <div className="flex-left-right">
                <h4 style={{ color: "var(--gray)", marginRight: 10 }}>
                  {
                    filtradas.filter((tag) => selectedTags.includes(tag.id))
                      .length
                  }{" "}
                  / {data.length}
                </h4>

                {/* Container para o ícone e a info */}
                <div className="icon-info-wrapper">
                  <Icons.CircleQuestion
                    size={15}
                    className="icons"
                    style={{ color: "var(--white)" }}
                    onMouseOver={() => setNeedTagInfo(key)}
                    onMouseOut={() => setNeedTagInfo(false)}
                  />
                  {needTagInfo === key && (
                    <div className="tags-info" style={{borderColor: color}}>
                      <b>{info}</b>
                    </div>
                  )}
                </div>

                {openBlocks[key] ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
              </div>
            </div>

            {/* LISTA DE TAGS */}
            {openBlocks[key] && (
              <div className="show-edit-tags">
                {filtradas.length === 0 ? (
                  <p className="no-tags">Nenhuma tag encontrada</p>
                ) : (
                  filtradas.map((tag) => (
                    <div
                      className="edit-tags"
                      key={tag.id}
                      style={{
                        borderColor: color,
                        backgroundColor: selectedTags.includes(tag.id)
                          ? color
                          : "var(--white)",
                      }}
                    >
                      {selectedTags.includes(tag.id) && (
                        <Icons.Check size={15} color="#fff" />
                      )}
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleChange(tag.id)}
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        style={{
                          color: selectedTags.includes(tag.id) ? "#fff" : color,
                        }}
                      >
                        <b>{tag.content}</b>
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* CONTADOR */}
      <h3 style={{ marginTop: 10 }}>{selectedTags.length} tags selecionadas</h3>
    </div>
  );
}

export default EditTags;
