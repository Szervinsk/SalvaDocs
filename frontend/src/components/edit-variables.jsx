import { MdOutlineEditNote } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { PiFilePdf } from "react-icons/pi";
import { MdFileUpload } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";

function EditVariables({
  etapas,
  etapaAtual,
  modelId,
  onClose,
  selectedTags,
  setSelectedTags,
  file,
  setFile,
  anexou,
  setAnexou,
  erroArquivo,
}) {
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

  const [moreTags, setMoreTags] = useState(false); // estado elevado
  const [sendFiles, setSendFiles] = useState(false); // estado elevado

  if (etapaAtual === 1) {
    return (
      <EditTags
        etapas={etapas}
        etapaAtual={etapaAtual}
        modelId={modelId}
        tags={tagsUniversais}
        onClose={onClose}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        moreTags={moreTags} // passa o estado
        setMoreTags={setMoreTags} // passa o setter
      />
    );
  } else if (etapaAtual === 2) {
    return (
      <EditExit
        etapas={etapas}
        etapaAtual={etapaAtual}
        modelId={modelId}
        onClose={onClose}
        file={file}
        setFile={setFile}
        anexou={anexou}
        setAnexou={setAnexou}
        sendFiles={sendFiles}
        setSendFiles={setSendFiles}
      />
    );
  } else if (etapaAtual === 3) {
    return (
      <EditAnalise etapas={etapas} etapaAtual={etapaAtual} onClose={onClose} />
    );
  }

  return null;
}

function EditTags({
  etapas,
  etapaAtual,
  modelId,
  tags,
  onClose,
  selectedTags,
  setSelectedTags,
  moreTags,
  setMoreTags,
}) {
  const outrasTags = [
    { id: 101, content: "Processo" },
    { id: 102, content: "Anexo" },
    { id: 103, content: "Protocolo" },
  ];

  useEffect(() => {
    const mapaPreSelecao = {
      Despacho: ["SEI", "Gdoc", "Data", "Assunto", "Resumo", "Documentos"],
      Parecer: ["SEI", "Gdoc", "Data", "Título", "Resumo", "Parecer"],
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

    if (mapaPreSelecao[modelId] && selectedTags.length === 0) {
      const preSelecionadas = tags
        .filter((tag) => mapaPreSelecao[modelId].includes(tag.content))
        .map((tag) => tag.id);

      setSelectedTags(preSelecionadas);
    }
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
        Você selecionou o modelo: <b>{modelId}</b>, todavia, você ainda pode ajustar os critérios de captura conforme queira antes de iniciar o processo.
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

      {/* SWITCH PARA MAIS TAGS */}
      <div
        className="flex-left-right"
        style={{ marginTop: 10, alignItems: "center" }}
      >
        <label className="switch">
          <input
            type="checkbox"
            checked={moreTags}
            onChange={() => setMoreTags(!moreTags)}
          />
          <span className="slider"></span>
        </label>
        <h3 style={{ marginLeft: 10 }}>
          Deseja adicionar tags de outros modelos
        </h3>
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

// --- EditExit e EditAnalise continuam iguais ---
function EditExit({
  etapas,
  etapaAtual,
  onClose,
  file,
  setFile,
  modelId,
  setSendFiles,
  sendFiles,
  setAnexou,
  erroArquivo,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f) setFile({ name: f.name });
  };

  const handleNotFile = () => {
    setFile(null);
    setAnexou(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setAnexou(true);
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={`edit-content ${erroArquivo ? "shake error-border" : ""}`}>
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
        Nos parâmetros de saída, insira o seu arquivo no campo de extração abaixo e após o
        envio, realizamos a análise das informações conforme suas
        especificações.
      </p>

      {file ? (
        <>
          <div className="edit-file">
            <div className="flex-left-right">
              <div className="box-icon-pdf">
                <PiFilePdf size={20} className="icons" />
              </div>
              <p>{file.name}</p>
            </div>
            <IoMdClose size={20} className="icons" onClick={handleNotFile} />
          </div>

          <div>
            <input
              type="checkbox"
              name="change-name-file"
              id="change-name-file"
            />
            <label htmlFor="change-name-file">
              Deseja alterar o nome do arquivo para "{modelId} + nº do
              processo"?
            </label>
          </div>
        </>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className="edit-dropzone"
        >
          <MdFileUpload size={40} />
          <p>Arraste um PDF ou clique para selecionar</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files[0])}
            accept="application/pdf"
            style={{ display: "none" }}
          />
        </div>
      )}

      <div className="flex-left-right">
        <>
          <label className="switch">
            <input
              type="checkbox"
              checked={sendFiles}
              onChange={() => setSendFiles(!sendFiles)}
            />
            <span className="slider"></span>
          </label>
          <h3 style={{ marginLeft: 10 }}>Deseja salvar o arquivo?</h3>
        </>
      </div>
    </div>
  );
}

function EditAnalise({ etapas, etapaAtual, onClose }) {
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

      <h3> se vc chegou aqui vc é foda</h3>
    </div>
  );
}

export default EditVariables;
