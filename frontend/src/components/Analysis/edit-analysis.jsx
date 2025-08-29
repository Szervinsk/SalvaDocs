import axios from "axios";
import { Icons } from "../../constants/icons";
import { useEffect } from "react";

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
    const tagsSelecionadas = (tags?.todasTags || [])
      .filter((tag) => selectedTags.includes(tag.id))
      .map((tag) => ({
        name: tag.content,
        type: tag.type,
        icon: tag.icon,
        regex: tag.regex,
        prompt: tag.prompt,
      }));

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
export default EditAnalise;