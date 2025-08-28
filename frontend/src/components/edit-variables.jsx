import { Icons } from "../constants/icons";
import { useState, useEffect, useRef } from "react";
import AlterNameWithTags from "./alterName";
import axios from "axios";

function EditVariables({
  etapas,
  etapaAtual,
  selectedModel,
  onClose,
  selectedTags,
  setSelectedTags,
  file,
  setFile,
  anexou,
  setAnexou,
  erroArquivo,
  setIsResponse,
  setDocSelecionado,
  setDocumentos,
  tags,
}) {
  const [moreTags, setMoreTags] = useState(false);
  const [sendFiles, setSendFiles] = useState(false);
  const [alterName, setAlterName] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- ETAPA 1: EditTags ---
  if (etapaAtual === 1) {
    return (
      <EditTags
        etapas={etapas}
        etapaAtual={etapaAtual}
        selectedModel={selectedModel}
        onClose={onClose}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        moreTags={moreTags}
        setMoreTags={setMoreTags}
        tags={tags}
      />
    );
  }
  // --- ETAPA 2: EditExit ---
  else if (etapaAtual === 2) {
    return (
      <EditExit
        etapas={etapas}
        etapaAtual={etapaAtual}
        selectedModel={selectedModel}
        onClose={onClose}
        file={file}
        setFile={setFile}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        sendFiles={sendFiles}
        setSendFiles={setSendFiles}
        erroArquivo={erroArquivo}
        setAlterName={setAlterName}
        alterName={alterName}
        setFileName={setFileName}
      />
    );
  }
  // --- ETAPA 3: EditAnalise ---
  else if (etapaAtual === 3) {
    return (
      <EditAnalise
        etapas={etapas}
        etapaAtual={etapaAtual}
        onClose={onClose}
        selectedTags={selectedTags}
        file={file}
        tags={tags}
        setIsResponse={setIsResponse}
        setDocSelecionado={setDocSelecionado}
        setDocumentos={setDocumentos}
        selectedModel={selectedModel}
        fileName={fileName}
      />
    );
  }

  return null;
}

function EditTags({
  etapas,
  etapaAtual,
  onClose,
  selectedModel,
  selectedTags,
  setSelectedTags,
  moreTags,
  setMoreTags,
  tags,
}) {
  const [outrasTags, setOutrasTags] = useState([]);
  const [tagsAtuais, setTagsAtuais] = useState([]);
  const { universais, parecer, programa, ia, todasTags } = tags;

  useEffect(() => {
    const mapaPreSelecao = {
      Despacho: [...universais, ...ia],
      Parecer: [...universais, ...parecer, ...ia],
      Programas: [...universais, ...programa, ...ia],
    };

    const chave = selectedModel?.name; // pega só o nome
    const tagsModelo = mapaPreSelecao[chave] || [];

    setTagsAtuais(tagsModelo);
    console.log(tagsModelo);

    // se ainda não tem nada selecionado, pré-seleciona
    if (tagsModelo.length > 0 && selectedTags.length === 0) {
      const preSelecionadas = tagsModelo.map((tag) => tag.id);
      setSelectedTags(preSelecionadas);
    }

    // recalcula sempre as outras tags
    const naoSelecionadas = todasTags.filter(
      (tag) => !tagsModelo.some((t) => t.id === tag.id)
    );
    setOutrasTags(naoSelecionadas);
    console.log(naoSelecionadas);
  }, [selectedModel, tags, selectedTags.length, setSelectedTags]);

  const handleChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="edit-content">
      {/* HEADER */}
      <div
        className="flex-left-right"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex-left-right">
          <Icons.EditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <Icons.Close size={20} className="icons" onClick={onClose} />
      </div>

      {/* DESCRIÇÃO */}
      <p className="edit-p">
        Você selecionou o modelo: <b>{selectedModel?.name}</b>, todavia, você
        ainda pode ajustar os critérios de captura conforme queira antes de
        iniciar o processo.
      </p>

      {/* TAGS PRINCIPAIS */}
      <div className="show-edit-tags">
        {tagsAtuais.map((tag) => (
          <div className="edit-tags" key={tag.id}>
            {selectedTags.includes(tag.id) && (
              <Icons.Check size={15} color="#fff" />
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
                <Icons.Check size={15} color="#fff" />
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

// --- EditExit ---
function EditExit({
  etapas,
  etapaAtual,
  onClose,
  file,
  setFile,
  selectedModel,
  selectedTags,
  erroArquivo,
  alterName,
  setAlterName,
  setFileName,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f) {
      setFile(f);
    }
  };

  const handleNotFile = () => {
    setFile(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]); // 🔹 já chama handleFile, que agora seta anexou
  };

  return (
    <div className={`edit-content ${erroArquivo ? "shake error-border" : ""}`}>
      {/* HEADER */}
      <div
        className="flex-left-right"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex-left-right">
          <Icons.EditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <Icons.Close size={20} className="icons" onClick={onClose} />
      </div>

      {/* DESCRIÇÃO */}
      <p className="edit-p">
        Nos parâmetros de saída, insira o seu arquivo no campo de extração
        abaixo e após o envio, realizamos a análise das informações conforme
        suas especificações.
      </p>

      {/* ARQUIVO SELECIONADO */}
      {file ? (
        <>
          <div className="edit-file">
            <div className="flex-left-right">
              <div className="box-icon-pdf">
                <Icons.Pdf_file size={20} className="icons" />
              </div>
              <p>{file.name}</p>
            </div>
            <Icons.Close size={20} className="icons" onClick={handleNotFile} />
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
          {isDragging && <>tá arrastando fi</>}
          <Icons.Upload size={40} />
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

      {/* SWITCH PARA SALVAR ARQUIVO */}
      <div className="flex-down-top" style={{ marginTop: 20 }}>
        <div className="flex-left-right">
          <label className="switch">
            <input
              type="checkbox"
              checked={alterName} // 🔹 usa alterName para controlar
              onChange={(e) => setAlterName(e.target.checked)} // 🔹 toggle certo
            />
            <span className="slider"></span>
          </label>
          <h3 style={{ marginLeft: 10 }}>Deseja alterar o nome do arquivo?</h3>
        </div>

        {alterName && (
          <AlterNameWithTags
            selectedTags={selectedTags}
            selectedModel={selectedModel}
            setFileName={setFileName}
          />
        )}
      </div>
    </div>
  );
}

// --- EditAnalise ---
function EditAnalise({
  etapas,
  etapaAtual,
  onClose,
  selectedTags,
  file,
  selectedModel,
  tags,
  setIsResponse,
  setDocSelecionado,
  setDocumentos,
  fileName,
}) {
  const handleSubmit = async () => {
    const tagsSelecionadas = (tags?.todasTags || []).filter((tag) =>
      selectedTags.includes(tag.id)
    );

    if (!file) {
      alert("Selecione um arquivo antes de enviar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("tags", JSON.stringify(tagsSelecionadas));
      formData.append("file", file);
      formData.append("templateName", fileName);
      formData.append("model", selectedModel?.name);

      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setDocumentos((prev) => [...(prev || []), response.data.document]);
      setDocSelecionado(response.data.document);
      console.log(
        "docSelecionado:",
        JSON.stringify(response.data.document, null, 2)
      );
      setIsResponse(true);
    } catch (error) {
      console.error("Erro ao enviar:", error.response?.data || error);
      alert("Erro ao enviar dados.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="edit-content">
      {/* HEADER */}
      <div
        className="flex-left-right"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex-left-right">
          <Icons.EditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <Icons.Close size={20} className="icons" onClick={onClose} />
      </div>

      <p className="edit-p">
        Agora é só deixar com a gente, basta só conferir se todas as tags foram
        selecionada e após isso, enviar o documento para realizarmos a coleta
        dos dados solicitados
      </p>

      <div>
        <strong>Tags selecionadas:</strong>
        {selectedTags.map((tag) => (
          <> {tag} </>
        ))}
      </div>

      <div>
        <strong>Arquivo:</strong>{" "}
        {file ? file.name : "Nenhum arquivo selecionado"}
      </div>

      <div className="flex-left-right" style={{ justifyContent: "flex-end" }}>
        <button
          className="upload-btn"
          onClick={handleSubmit}
          style={{ marginTop: 10 }}
        >
          Analisar documento
        </button>
      </div>
    </div>
  );
}

export default EditVariables;
