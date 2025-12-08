import { Icons } from "../../../../constants/icons";
import { useEffect, useState } from "react";
import axios from "axios";

function EditAnalise({
  etapas,
  etapaAtual,
  onClose,
  selectedTags,
  files, // ALTERADO: Recebe o array de arquivos
  selectedModel,
  tags,
  // fileName,  <-- REMOVIDO (agora está dentro de filesConfig)
  // selectedFolder, <-- REMOVIDO (agora está dentro de filesConfig)
  filesConfig, // NOVO: Recebe as configurações individuais (nomes e pastas)
  setDocumentos,
  setDocSelecionado,
  showAlert,
  setTool,
}) {
  const [loading, setLoading] = useState(false);

  // --- FUNÇÃO PRINCIPAL PARA CONECTAR COM O BACK-END ---
  const handleSubmit = async () => {
    // 1. Validação básica
    if (!files || files.length === 0) {
      showAlert("error", "Nenhum arquivo selecionado para análise.");
      return;
    }

    // 2. Validação: Verifica se TODOS os arquivos têm uma pasta definida
    const missingFolder = files.some((_, index) => !filesConfig[index]?.folderId);
    if (missingFolder) {
      showAlert("warning", "Por favor, selecione uma pasta de destino para todos os arquivos na etapa anterior.");
      return;
    }

    setLoading(true);

    try {
      // 3. Cria um array de Promessas (requisições) para enviar tudo junto
      const uploadPromises = files.map((file, index) => {
        const config = filesConfig[index];
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", selectedModel.name);
        formData.append("tags", JSON.stringify(selectedTags));
        // Usa o nome configurado ou o original
        formData.append("templateName", config.alterName ? config.fileName : file.name);
        formData.append("folderId", config.folderId); // ID da pasta individual

        // Retorna a promessa da requisição axios
        return axios.post("documents/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      // 4. Aguarda TODAS as requisições terminarem
      const responses = await Promise.all(uploadPromises);

      // 5. Processa os resultados
      const novosDocumentos = responses.map(res => res.data.document);

      // Adiciona todos os novos documentos à lista
      setDocumentos((prev) => [...novosDocumentos, ...prev]);

      showAlert("success", `${novosDocumentos.length} documento(s) analisado(s) com sucesso!`);

      // Abre o primeiro documento criado para visualização
      if (novosDocumentos.length > 0) {
        setDocSelecionado(novosDocumentos[0]);
      }

      setTool(1); // Volta para a Home

    } catch (error) {
      console.error("Erro na análise em lote:", error);
      // Tenta pegar a mensagem de erro específica ou usa uma genérica
      const errorMessage = error.response?.data?.error || "Falha ao analisar um ou mais documentos.";
      showAlert("error", errorMessage);
    } finally {
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
        Confira o resumo da sua solicitação. Se tudo estiver correto, clique em "Analisar documentos" para iniciar a extração em lote.
      </p>

      <div className="summary-card">
        <dl className="summary-list">
          <div className="summary-item">
            <dt><Icons.Model size={16} /> Modelo Utilizado</dt>
            <dd>{selectedModel?.name || "-"}</dd>
          </div>
          
          {/* RESUMO ATUALIZADO PARA MÚLTIPLOS ARQUIVOS */}
          <div className="summary-item">
            <dt><Icons.FileText size={16} /> Arquivos</dt>
            <dd>{files.length} arquivo(s) selecionado(s)</dd>
          </div>

          <div className="summary-item">
            <dt><Icons.Folder size={16} /> Destino</dt>
            <dd>Configurado individualmente</dd>
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
              Analisar documentos
            </>
          )}
        </button>
      </footer>
    </div>
  );
}

export default EditAnalise;