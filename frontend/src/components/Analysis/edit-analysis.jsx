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
  user,
  setEtapaAtual,
  setTool

}) {
  const handleSubmit = async () => {
    
    if (!file) {
      alert("Selecione um arquivo antes de enviar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("tags", JSON.stringify(selectedTags)); // tags como string
      formData.append("file", file);
      formData.append("templateName", fileName || "");
      formData.append("model", selectedModel?.name || "");
      formData.append("ownerId", user?.id || "");

      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ou onde vc salva
          },
        }
      );
      console.log("Resposta do servidor:", response.data);

      setDocumentos((prev) => [...(prev || []), response.data.document]);
      setDocSelecionado(response.data.document);
      setIsResponse(true);
      setEtapaAtual(1);
      setTool(6);
      console.log("docSelecionado:", response.data.document);
    } catch (error) {
      console.error(
        "Erro ao enviar:",
        error.response?.data || error.message || error
      );
      alert("Erro ao enviar dados. Verifique o console para mais detalhes.");
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

        {/* <div>
        <h2>tags aqui man</h2>
        <h3>{JSON.stringify(tagsSelecionadas)}</h3>
      </div> */}

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
