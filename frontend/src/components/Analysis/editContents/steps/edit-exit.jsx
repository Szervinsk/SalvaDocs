import { Icons } from "../../../../constants/icons";
import { useState, useRef, useEffect } from "react"; // Importe useEffect
import { motion, AnimatePresence } from "framer-motion";
import AlterNameWithTags from "./alterName";

// --- Constantes para validação ---
const MAX_FILES = 5;
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// --- Sub-componente para configuração INDIVIDUAL de cada arquivo ---
const FileConfigItem = ({ 
  file, 
  index, 
  pastas, 
  onUpdateConfig, 
  selectedTags, 
  selectedModel, 
  tags, 
  modelos,
  initialConfig 
}) => {
  const [alterName, setAlterName] = useState(initialConfig?.alterName || false);
  const [folderId, setFolderId] = useState(initialConfig?.folderId || "");
  
  // Atualiza o pai sempre que folderId ou alterName mudar
  useEffect(() => {
    onUpdateConfig(index, { folderId, alterName });
  }, [folderId, alterName]);

  // Função que recebe o nome do AlterNameWithTags
  const handleFileNameChange = (newName) => {
    onUpdateConfig(index, { fileName: newName });
  };

  return (
    <div className="file-config-card" style={{ marginBottom: "20px", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px" }}>
      <header className="setting-row__header" style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Icons.FileText size={18} />
        <h4 style={{ margin: 0 }}>{file.name}</h4>
      </header>

      {/* Configuração de Pasta */}
      <div className="setting-row">
        <div className="setting-row__info">
          <Icons.Folder size={20} />
          <div>
            <h4>Salvar em</h4>
            <p>Escolha a pasta de destino.</p>
          </div>
        </div>
        <div className="setting-row__control">
          <div className="custom-select-wrapper">
            <select
              className="custom-select"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
            >
              <option value="" disabled>Selecione...</option>
              {pastas.map((folder) => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Configuração de Renomear */}
      <div className="setting-row">
        <div className="setting-row__info">
          <Icons.EditNote size={20} />
          <div>
            <h4>Alterar nome</h4>
            <p>Gere nomes dinâmicos.</p>
          </div>
        </div>
        <div className="setting-row__control">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={alterName}
              onChange={(e) => setAlterName(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <AnimatePresence>
        {alterName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="alter-name-wrapper"
          >
            <AlterNameWithTags
              selectedTags={selectedTags}
              selectedModel={selectedModel}
              setFileName={handleFileNameChange} // Passa a função local
              tags={tags}
              modelos={modelos}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


function EditExit({
  onClose,
  files = [],
  setFiles,
  // Props removidas daqui pois agora são gerenciadas internamente ou passadas via função:
  // alterName, setAlterName, setFileName, selectedFolder, setSelectedFolder
  
  // Props mantidas para passar aos filhos:
  selectedTags,
  tags,
  modelos,
  selectedModel,
  erroArquivo,
  showAlert,
  pastas,
  // Nova prop para comunicar as configs ao pai (AnalysePage)
  onConfigsChange 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Estado local para armazenar as configurações de CADA arquivo
  // Formato: [ { folderId: 1, alterName: true, fileName: "NovoNome" }, ... ]
  const [filesConfig, setFilesConfig] = useState([]);

  // Inicializa o filesConfig quando files mudar
  useEffect(() => {
    setFilesConfig(prev => {
      // Mantém configs existentes, cria novas para novos arquivos
      const newConfigs = files.map((_, i) => prev[i] || { folderId: "", alterName: false, fileName: "" });
      return newConfigs;
    });
  }, [files.length]);

  // Atualiza o pai (AnalysePage) sempre que filesConfig mudar
  useEffect(() => {
    if (onConfigsChange) {
      onConfigsChange(filesConfig);
    }
  }, [filesConfig, onConfigsChange]);

  const handleUpdateConfig = (index, newValues) => {
    setFilesConfig(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...newValues };
      return updated;
    });
  };

  const currentTotalSize = files.reduce((acc, file) => acc + file.size, 0);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFilesToAdd = (incomingFiles) => {
    const newFiles = Array.from(incomingFiles).filter(
      (f) => f.type === "application/pdf" || f.type === "text/plain"
    );
    if (newFiles.length === 0) return;
    if (files.length + newFiles.length > MAX_FILES) {
      showAlert("warning", `Você só pode adicionar até ${MAX_FILES} arquivos por vez.`);
      return;
    }
    const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    if (currentTotalSize + newFilesSize > MAX_SIZE_BYTES) {
      showAlert("warning", `O tamanho total excede o limite de ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFilesToAdd(event.target.files);
    }
    event.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesToAdd(e.dataTransfer.files);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    // O useEffect cuidará de atualizar o filesConfig
  };

  return (
    <div className={`analysis-step-page ${erroArquivo ? "shake" : ""}`}>
      <header className="workflow-header">
        <div className="workflow-header__title">
          <Icons.Upload size={24} />
          <h2>Upload e Saída</h2>
        </div>
        <button className="icon-button" onClick={onClose} title="Fechar">
          <Icons.Close size={20} />
        </button>
      </header>

      <div className="analysis-scroll">
        <p className="page-description">
          Arraste ou selecione até 5 arquivos PDF ou TXT (Máx. 5MB no total).
        </p>

        {/* --- ÁREA DE UPLOAD --- */}
        <div className="upload-section">
          {files.length < MAX_FILES && (
            <motion.div
              className={`dropzone compact ${isDragging ? "is-dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{ marginBottom: files.length > 0 ? "1rem" : "0" }}
            >
              <Icons.Upload size={32} />
              <p>{isDragging ? "Solte os arquivos aqui" : "Clique ou arraste para adicionar PDFs"}</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf, text/plain, .txt" multiple hidden />
            </motion.div>
          )}

          {/* --- Indicador de Uso --- */}
          {files.length > 0 && (
            <div style={{ marginBottom: "10px", fontSize: "0.85rem", color: "#666" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Uso total: <strong>{formatBytes(currentTotalSize)}</strong></span>
                <span>Limite: {MAX_SIZE_MB}MB</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#eee", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${(currentTotalSize / MAX_SIZE_BYTES) * 100}%`, height: "100%", background: currentTotalSize > MAX_SIZE_BYTES * 0.9 ? "#ff4d4f" : "#4caf50", transition: "width 0.3s ease" }} />
              </div>
            </div>
          )}

          {/* --- Lista de Arquivos (Preview) --- */}
          <div className="file-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <AnimatePresence mode="popLayout">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="file-preview"
                >
                  <div className="file-preview__info">
                    <div className="file-preview__icon"><Icons.FileText size={20} /></div>
                    <span className="file-name-truncate" title={file.name}>{file.name}</span>
                    <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "auto", marginRight: "10px" }}>{formatBytes(file.size)}</span>
                  </div>
                  <button className="icon-button" onClick={() => removeFile(index)} title="Remover arquivo">
                    <Icons.Close size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <hr className="divider" style={{ margin: "1.5rem 0" }} />

        {/* --- GRUPO DE CONFIGURAÇÕES (Por Arquivo) --- */}
        <div className="settings-group">
          {files.length > 0 ? (
            files.map((file, index) => (
              <FileConfigItem
                key={`${file.name}-${index}`}
                index={index}
                file={file}
                pastas={pastas}
                selectedTags={selectedTags}
                selectedModel={selectedModel}
                tags={tags}
                modelos={modelos}
                onUpdateConfig={handleUpdateConfig}
                initialConfig={filesConfig[index]}
              />
            ))
          ) : (
            <div className="empty-text">Nenhum arquivo adicionado.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditExit;