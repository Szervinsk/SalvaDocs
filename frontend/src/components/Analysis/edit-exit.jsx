import AlterNameWithTags from "../alterName";
import { Icons } from "../../constants/icons";
import { useState, useRef } from "react";
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
  limitador,
  setLimitador,
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

      <div className="flex-down-top" style={{ marginTop: 20 }}>
        <div className="flex-left-right">
          <label className="switch">
            <input
              type="checkbox"
              checked={limitador} // 🔹 usa limitador para controlar
              onChange={(e) => setLimitador(e.target.checked)} // 🔹 toggle certo
            />
            <span className="slider"></span>
          </label>
          <h3 style={{ marginLeft: 10 }}>Deseja adicionar algum limitador de texto?</h3>
        </div>
      </div>
    </div>
  );
}

export default EditExit;
