import { MdOutlineEditNote } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";

function EditVariables({ etapas, etapaAtual, modelId, onClose }) {
  const tagsUniversais = [
    { id: 1, content: "SEI" },
    { id: 2, content: "Gdoc" },
    { id: 3, content: "Data" },
    { id: 4, content: "Resumo" },
    { id: 5, content: "Destinatários" },
    { id: 6, content: "Título" },
    { id: 7, content: "Assunto" },
    { id: 8, content: "Documentos" },
    { id: 9, content: "Contrato" },
    { id: 10, content: "Valor" },
    { id: 11, content: "Assinado por" },
    { id: 12, content: "Parecer" },
    { id: 13, content: "Empresa" },
  ];

  if (etapaAtual === 1) {
    return (
      <EditTags
        etapas={etapas}
        etapaAtual={etapaAtual}
        modelId={modelId}
        tags={tagsUniversais}
        onClose={onClose}
      />
    );
  } else if (etapaAtual === 2) {
    return (
      <EditExit
        etapas={etapas}
        etapaAtual={etapaAtual}
        modelId={modelId}
        onClose={onClose}
      />
    );
  }

  return null;
}

function EditTags({ etapas, etapaAtual, modelId, tags, onClose }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [moreTags, setMoreTags] = useState(false);

  const outrasTags = [
    { id: 101, content: "Processo" },
    { id: 102, content: "Anexo" },
    { id: 103, content: "Protocolo" },
  ];

  useEffect(() => {
    let preSelecionadas = [];

    const mapaPreSelecao = {
      Despachos: ["SEI", "Gdoc", "Data", "Assunto", "Resumo", "Documentos"],
      Pareceres: ["SEI", "Gdoc", "Data", "Título", "Resumo", "Parecer"],
      "Programas de Integridade": [
        "SEI",
        "Gdoc",
        "Data",
        "Empresa",
        "Resumo",
        "Contrato",
        "Valor",
      ],
    };

    if (mapaPreSelecao[modelId]) {
      preSelecionadas = tags
        .filter((tag) => mapaPreSelecao[modelId].includes(tag.content))
        .map((tag) => tag.id);
    }

    setSelectedTags(preSelecionadas);
  }, [modelId, tags]);

  const handleChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="edit-content">
      <div
        className="flex-left-right"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex-left-right">
          <MdOutlineEditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <IoMdClose size={20} className="icons" onClick={onClose} />
      </div>

      <p className="edit-p">
        Você selecionou o modelo: <b>{modelId}</b>. Ajuste os critérios de
        captura antes de iniciar o processo.
      </p>

      {/* TAGS PRINCIPAIS */}
      <div className="show-edit-tags">
        {tags.map((tag) => (
          <div className="edit-tags" key={tag.id}>
            {selectedTags.includes(tag.id) && (
              <FaCheck size={15} color="#fff" />
            )}
            <input
              type="checkbox"
              id={`tag-${tag.id}`}
              checked={selectedTags.includes(tag.id)}
              onChange={() => handleChange(tag.id)}
            />
            <label htmlFor={`tag-${tag.id}`}>{tag.content}</label>
          </div>
        ))}
      </div>

      {/* CHECKBOX PARA MAIS TAGS */}
      <div className="flex-left-right" style={{ marginTop: 10 }}>
        <input
          type="checkbox"
          id="btn-moretags"
          checked={moreTags}
          onChange={(e) => setMoreTags(e.target.checked)}
        />
        <label htmlFor="btn-moretags">
          <h3>Deseja adicionar tags de outros modelos</h3>
        </label>
      </div>

      {/* TAGS EXTRAS */}
      {moreTags && (
        <div className="show-edit-tags" style={{ marginTop: 10 }}>
          {outrasTags.map((tag) => (
            <div className="edit-tags" key={tag.id}>
              {selectedTags.includes(tag.id) && (
                <FaCheck size={15} color="#fff" />
              )}
              <input
                type="checkbox"
                id={`tag-${tag.id}`}
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleChange(tag.id)}
              />
              <label htmlFor={`tag-${tag.id}`}>{tag.content}</label>
            </div>
          ))}
        </div>
      )}

      {/* CONTADOR */}
      <h3 style={{ marginTop: 10 }}>{selectedTags.length} tags selecionadas</h3>
    </div>
  );
}

function EditExit({ etapas, etapaAtual, onClose }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f) {
      setFile({
        name: f.name,
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="edit-content">
      <div
        className="flex-left-right"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex-left-right">
          <MdOutlineEditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <IoMdClose size={20} className="icons" onClick={onClose} />
      </div>

      <p className="edit-p">
        Nos parâmetros de saída, você define como os dados serão apresentados.
        Basta inserir seus arquivos no campo de extração de documentos e após o
        envio, realizamos a análise das informações conforme suas
        especificações.
      </p>

      <div className="flex-left-right" style={{ marginBottom: 10 }}>
        <MdOutlineEditNote size={20} className="icons" />
        <h3>{etapas[etapaAtual - 1].text}</h3>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: isDragging ? "2px dashed #597DFF" : "2px dashed #ccc",
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          cursor: "pointer",
          background: isDragging ? "#f0f6ff" : "#fafafa",
        }}
      >
        {file ? (
          file.preview ? (
            <img
              src={file.preview}
              alt="Preview"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <p>📄 {file.name}</p>
          )
        ) : (
          <>
            <MdFileUpload size={40} />
            <p>Arraste um PDF ou clique para selecionar</p>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFile(e.target.files[0])}
          accept="application/pdf,image/*"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

export default EditVariables;
