import { Icons } from "../../../../constants/icons";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlterNameWithTags from "./alterName";

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
  file,
  setFile,
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

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
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
        Arraste ou selecione o arquivo PDF desejado e configure as opções de saída.
      </p>

      {/* --- ÁREA DE UPLOAD --- */}
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="file-preview">
            <div className="file-preview__info">
              <div className="file-preview__icon"><Icons.FileText size={20} /></div>
              <span>{file.name}</span>
            </div>
            <button className="icon-button" onClick={() => setFile(null)} title="Remover arquivo">
              <Icons.Close size={20} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`dropzone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <Icons.Upload size={40} />
            <p>{isDragging ? "Solte o arquivo para anexar" : "Arraste um PDF ou clique para selecionar"}</p>
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files[0])} accept="application/pdf" hidden />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- GRUPO DE CONFIGURAÇÕES --- */}
      <div className="settings-group">
        <SettingRow
          icon={<Icons.Folder size={20} />}
          title="Salvar em"
          description="Escolha a pasta de destino para o documento analisado."
          control={
            <div className="custom-select-wrapper">
              <select
                name="folder"
                id="folder"
                className="custom-select"
                value={selectedFolder ? selectedFolder.id : ""}
                onChange={(e) => {
                  const folderId = e.target.value;
                  // Encontramos o objeto completo da pasta correspondente ao ID selecionado.
                  const folderObject = pastas.find((p) => p.id.toString() === folderId);
                  // Salvamos o OBJETO INTEIRO no estado.
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
          description="Gere um nome dinâmico com base nas tags."
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
              <AlterNameWithTags selectedTags={selectedTags} selectedModel={selectedModel} setFileName={setFileName} tags={tags} modelos={modelos}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
}

export default EditExit;