import { Icons } from "../../../../constants/icons";
import { useEffect, useState } from "react";
import axios from "axios"; // Importe o axios

function EditAnalise({
  etapas,
  etapaAtual,
  onClose,
  selectedTags,
  file,
  selectedModel,
  tags,
  fileName,
  setDocumentos,
  setDocSelecionado,
  showAlert,
  setTool,
  selectedFolder,
}) {
  const [loading, setLoading] = useState(false);

  // --- FUNÇÃO PRINCIPAL PARA CONECTAR COM O BACK-END ---
  const handleSubmit = async () => {
    // 1. Validação: Verifica se existe um arquivo
    if (!file) {
      showAlert("error", "Nenhum arquivo selecionado para análise.");
      return;
    }

    setLoading(true);

    // 2. Monta o FormData para enviar arquivo + dados
    const formData = new FormData();
    formData.append("file", file); // O arquivo PDF
    formData.append("model", selectedModel.name); // O nome do modelo
    formData.append("tags", JSON.stringify(selectedTags)); // Os IDs das tags (em formato JSON string)
    formData.append("templateName", fileName || file.name); // O nome final do arquivo
    formData.append("folderId", selectedFolder.id);

    try {
      // 3. Faz a requisição POST para a sua API
      const response = await axios.post("documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 4. Lida com a resposta de sucesso
      const { document: novoDocumento } = response.data;

      // Adiciona o novo documento à lista de documentos existente
      setDocumentos((prevDocumentos) => [novoDocumento, ...prevDocumentos]);

      showAlert("success", "Documento analisado com sucesso!");

      // Abre o documento recém-criado no painel OpenDocs
      setDocSelecionado(novoDocumento);

      // Opcional: Redireciona para a tela Home (tool 1) após o sucesso
      setTool(1);

    } catch (error) {
      // 5. Lida com erros da API
      console.error("Erro ao analisar o documento:", error);
      const errorMessage = error.response?.data?.error || "Falha ao analisar o documento.";
      showAlert("error", errorMessage);
    } finally {
      // 6. Finaliza o estado de loading
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !loading) handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, loading]);

  return (
    <div className="analysis-step-page">
      <header className="workflow-header">
        <div className="workflow-header__title">
          <Icons.Check size={24} />
          <h2>{etapas[etapaAtual - 1].text}</h2>
        </div>
        <button className="icon-button" onClick={onClose} title="Fechar" disabled={loading}>
          <Icons.Close size={20} />
        </button>
      </header>

      <p className="page-description">
        Confira o resumo da sua solicitação. Se tudo estiver correto, clique em "Analisar documento" para iniciar a extração.
      </p>

      <div className="summary-card">
        <dl className="summary-list">
          <div className="summary-item">
            <dt><Icons.Model size={16} /> Modelo Utilizado</dt>
            <dd>{selectedModel?.name || "-"}</dd>
          </div>
          <div className="summary-item">
            <dt><Icons.FileText size={16} /> Arquivo de Entrada</dt>
            <dd>{file?.name || "Nenhum"}</dd>
          </div>
          <div className="summary-item">
            <dt><Icons.EditNote size={16} /> Nome do Arquivo de Saída</dt>
            <dd>{fileName || file?.name || "Não definido"}</dd>
          </div>
          <div className="summary-item">
            <dt><Icons.Folder size={16} /> Pasta de saída</dt>
            <dd>{selectedFolder ? selectedFolder.name : "Não definido"}</dd>
          </div>
          <div className="summary-item">
            <dt><Icons.Tags size={16} /> Tags Selecionadas ({selectedTags.length})</dt>
            <dd className="summary-tag-list">
              {selectedTags.length > 0 ? selectedTags.map((selectedId) => {
                const tagObj = tags.find((tag) => tag.id === selectedId);
                return tagObj ? <span key={selectedId} className="tag-pill-sm">{tagObj.name}</span> : null;
              }) : <span>Nenhuma tag selecionada</span>}
            </dd>
          </div>
        </dl>
      </div>

      <footer className="workflow-footer">
        <button className="btn-primary" style={{width: "200px"}} onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Icons.Spinner size={16} className="spinner rotating" /> 
              Analisando...
            </>
          ) : (
            <>
              <Icons.Send size={16} />
              Analisar documento
            </>
          )}
        </button>
      </footer>
    </div>
  );
}

export default EditAnalise;