import { MdOutlineEditNote } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { PiFilePdf } from "react-icons/pi";
import { MdFileUpload } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import OpenDocs from "./open-docs";

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
  setIsResponse,
  setResultados,
  tagsUniversais,
  tagsParecer,
  tagsPrograma,
  tagsIA,
}) {

  const [moreTags, setMoreTags] = useState(false);
  const [sendFiles, setSendFiles] = useState(false);

  // --- ETAPA 1: EditTags ---
  if (etapaAtual === 1) {
    return (
      <EditTags
        etapas={etapas}
        etapaAtual={etapaAtual}
        modelId={modelId}
        onClose={onClose}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        moreTags={moreTags}
        setMoreTags={setMoreTags}
        tagsUniversais={tagsUniversais}
        tagsParecer={tagsParecer}
        tagsPrograma={tagsPrograma}
        tagsIA={tagsIA}
      />
    );
  }
  // --- ETAPA 2: EditExit ---
  else if (etapaAtual === 2) {
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
        erroArquivo={erroArquivo}
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
        tagsUniversais={tagsUniversais}
        tagsParecer={tagsParecer}
        tagsPrograma={tagsPrograma}
        tagsIA={tagsIA}
        setIsResponse={setIsResponse}
        setResultados={setResultados}
      />
    );
  }

  return null;
}

function EditTags({
  etapas,
  etapaAtual,
  onClose,
  modelId,
  selectedTags,
  setSelectedTags,
  moreTags,
  setMoreTags,
  tagsUniversais,
  tagsParecer,
  tagsPrograma,
  tagsIA,
}) {
  const [outrasTags, setOutrasTags] = useState([]);
  const [tagsAtuais, setTagsAtuais] = useState([]);

  useEffect(() => {
    const mapaPreSelecao = {
      Despacho: [...tagsUniversais, ...tagsIA],
      Parecer: [...tagsUniversais, ...tagsParecer, ...tagsIA],
      Programas: [...tagsUniversais, ...tagsPrograma, ...tagsIA],
    };

    const chave = modelId.trim();
    const tagsModelo = mapaPreSelecao[chave] || [];
    setTagsAtuais(tagsModelo);
    console.log(tagsModelo);

    // se ainda não tem nada selecionado, pré-seleciona
    if (tagsModelo.length > 0 && selectedTags.length === 0) {
      const preSelecionadas = tagsModelo.map((tag) => tag.id);
      setSelectedTags(preSelecionadas);
    }

    // recalcula sempre as outras tags
    const todasTags = [
      ...tagsUniversais,
      ...tagsParecer,
      ...tagsPrograma,
      ...tagsIA,
    ];
    const naoSelecionadas = todasTags.filter(
      (tag) => !tagsModelo.some((t) => t.id === tag.id)
    );
    setOutrasTags(naoSelecionadas);
    console.log(naoSelecionadas);
  }, [
    modelId,
    tagsUniversais,
    tagsParecer,
    tagsPrograma,
    tagsIA,
    selectedTags.length,
    setSelectedTags,
  ]);

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
          <MdOutlineEditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <IoMdClose size={20} className="icons" onClick={onClose} />
      </div>

      {/* DESCRIÇÃO */}
      <p className="edit-p">
        Você selecionou o modelo: <b>{modelId}</b>, todavia, você ainda pode
        ajustar os critérios de captura conforme queira antes de iniciar o
        processo.
      </p>

      {/* TAGS PRINCIPAIS */}
      <div className="show-edit-tags">
        {tagsAtuais.map((tag) => (
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

// --- EditExit ---
function EditExit({
  etapas,
  etapaAtual,
  onClose,
  file,
  setFile,
  modelId,
  sendFiles,
  setSendFiles,
  setAnexou,
  erroArquivo,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f) setFile(f); // <-- guarda o File real, não só o nome
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
      {/* HEADER */}
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
          {isDragging && <>tá arrastando fi</>}
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

      {/* SWITCH PARA SALVAR ARQUIVO */}
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

// --- EditAnalise ---
function EditAnalise({
  etapas,
  etapaAtual,
  onClose,
  selectedTags,
  file,
  tagsUniversais,
  tagsParecer,
  tagsPrograma,
  tagsIA,
  setIsResponse,
  setResultados,
}) {
  const handleSubmit = async () => {
    try {
      // junta todas as tags recebidas
      const todasTags = [
        ...tagsUniversais,
        ...tagsParecer,
        ...tagsPrograma,
        ...tagsIA,
      ];

      // pega os objetos completos das tags selecionadas
      const tagsSelecionadas = todasTags.filter((tag) =>
        selectedTags.includes(tag.id)
      );

      // agora sim cria o formData
      const formData = new FormData();
      formData.append("tags", JSON.stringify(tagsSelecionadas));

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Enviado com sucesso:", response.data);
      alert("Enviado com sucesso!");

      // guarda os resultados do backend
      setResultados(response.data.resultados);

      // mostra a tela de resultados
      onClose();

      setIsResponse(true);
    } catch (error) {
      console.error("Erro ao enviar:", error);
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
          <MdOutlineEditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <IoMdClose size={20} className="icons" onClick={onClose} />
      </div>

      <p className="edit-p">
        Agora é só deixar com a gente, basta só conferir se todas as tags foram
        selecionada e após isso, enviar o documento para realizarmos a coleta
        dos dados solicitados
      </p>

      <div>
        <strong>Tags selecionadas:</strong>
        <pre>{JSON.stringify(selectedTags.content, null, 2)}</pre>
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
