import { Icons } from "../../../../constants/icons";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlterNameWithTags from "./alterName";

// --- Constantes para validação ---
const MAX_FILES = 5;
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 5MB em Bytes

// --- Sub-componente reutilizável para cada linha de configuração ---
const SettingRow = ({ icon, title, description, control }) => (
  <div className="setting-row">
    <div className="setting-row__info">
      {icon}
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
    <div className="setting-row__control">{control}</div>
  </div>
);

function EditExit({
  onClose,
  files = [], 
  setFiles,
  alterName,
  setAlterName,
  setFileName,
  selectedTags,
  tags,
  modelos,
  selectedModel,
  erroArquivo,
  pastas,
  selectedFolder,
  setSelectedFolder,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Calcula o tamanho total atual dos arquivos já carregados
  const currentTotalSize = files.reduce((acc, file) => acc + file.size, 0);

  // Função auxiliar para formatar bytes em MB/KB
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Função centralizada para processar adição de arquivos
  const handleFilesToAdd = (incomingFiles) => {
    const newFiles = Array.from(incomingFiles).filter(f => f.type === "application/pdf" || f.type === "text/plain");
    
    if (newFiles.length === 0) return;

    // 1. Validação de Quantidade
    if (files.length + newFiles.length > MAX_FILES) {
      alert(`Você só pode adicionar até ${MAX_FILES} arquivos por vez.`);
      return;
    }

    // 2. Validação de Tamanho Total
    const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    const potentialTotalSize = currentTotalSize + newFilesSize;

    if (potentialTotalSize > MAX_SIZE_BYTES) {
      alert(`O tamanho total dos arquivos excede o limite de ${MAX_SIZE_MB}MB.\nEspaço restante: ${formatBytes(MAX_SIZE_BYTES - currentTotalSize)}`);
      return;
    }

    // Adiciona os novos arquivos ao array existente
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

      <p className="page-description">
        Arraste ou selecione até 5 arquivos PDF ou TXT (Máx. 5MB no total).
      </p>

      {/* --- ÁREA DE UPLOAD E PREVIEW --- */}
      <div className="upload-section">
        {files.length < MAX_FILES && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`dropzone compact ${isDragging ? "is-dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ marginBottom: files.length > 0 ? "1rem" : "0" }}
          >
            <Icons.Upload size={32} />
            <p>
              {isDragging 
                ? "Solte os arquivos aqui" 
                : "Clique ou arraste para adicionar PDFs"}
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="application/pdf, text/plain, .txt" 
              multiple 
              hidden 
            />
          </motion.div>
        )}

        {/* --- Indicador de Uso de Armazenamento --- */}
        {files.length > 0 && (
          <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: '#666' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Uso total: <strong>{formatBytes(currentTotalSize)}</strong></span>
              <span>Limite: {MAX_SIZE_MB}MB</span>
            </div>
            {/* Barra de Progresso Simples */}
            <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${(currentTotalSize / MAX_SIZE_BYTES) * 100}%`, 
                  height: '100%', 
                  background: currentTotalSize > (MAX_SIZE_BYTES * 0.9) ? '#ff4d4f' : '#4caf50', // Fica vermelho se passar de 90%
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
          </div>
        )}

        {/* Lista de Arquivos */}
        <div className="file-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: 'auto', marginRight: '10px' }}>
                    {formatBytes(file.size)}
                  </span>
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

      {/* --- GRUPO DE CONFIGURAÇÕES --- */}
      <div className="settings-group">
        <SettingRow
          icon={<Icons.Folder size={20} />}
          title="Salvar em"
          description="Escolha a pasta de destino para os documentos analisados."
          control={
            <div className="custom-select-wrapper">
              <select
                name="folder"
                id="folder"
                className="custom-select"
                value={selectedFolder ? selectedFolder.id : ""}
                onChange={(e) => {
                  const folderId = e.target.value;
                  const folderObject = pastas.find((p) => p.id.toString() === folderId);
                  setSelectedFolder(folderObject);
                }}
              >
                <option value="" disabled>Selecione uma pasta...</option>
                {pastas.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        <SettingRow
          icon={<Icons.EditNote size={20} />}
          title="Alterar nome do arquivo de saída"
          description="Gere nomes dinâmicos com base nas tags."
          control={
            <label className="toggle-switch">
              <input type="checkbox" checked={alterName} onChange={(e) => setAlterName(e.target.checked)} />
              <span className="slider"></span>
            </label>
          }
        />
        <AnimatePresence>
          {alterName && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="alter-name-wrapper">
              <AlterNameWithTags selectedTags={selectedTags} selectedModel={selectedModel} setFileName={setFileName} tags={tags} modelos={modelos} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
}

export default EditExit;