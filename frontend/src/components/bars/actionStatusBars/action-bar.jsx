import { Icons } from "../../../constants/icons";

// 1. Componente reutilizável para exibir informações de status
const InfoBlock = ({ title, icon, children }) => (
  <div className="info-block">
    <h4 className="info-block__title">{title}</h4>
    <div className="info-block__content">
      {icon}
      <h3 className="info-block__value">{children}</h3>
    </div>
  </div>
);

// 2. Componente principal ActionBar
function ActionBar({
  docSelecionado,
  selectedModel,
  setDocSelecionado,
  selectedTags,
  etapaAtual,
  file,
  setMore,
  more,
  setTool,
  tool,
}) {
  
  // 3. Lógica de renderização movida para fora do JSX para maior clareza
  const renderInfoContent = () => {
    if (docSelecionado && !selectedModel && tool === 6) {
      return (
        <InfoBlock
          title="Arquivo selecionado"
          icon={<Icons.Selected size={16} className="icon--accent" />}
        >
          {docSelecionado.templateName || docSelecionado.name}
        </InfoBlock>
      );
    }

    if (selectedModel && !docSelecionado) {
      return (
        <InfoBlock
          title="Modelo em uso"
          icon={<Icons.Selected size={16} className="icon--accent" />}
        >
          Modelo {selectedModel.name}
        </InfoBlock>
      );
    }

    if (selectedModel && selectedTags?.length >= 1 && etapaAtual >= 2) {
      return (
        <InfoBlock
          title="Quantidade de tags"
          icon={<Icons.Tags size={16} className="icon--default" />}
        >
          {selectedTags.length} tags selecionadas
        </InfoBlock>
      );
    }
    
    if (etapaAtual === 3 && file) {
      return (
        <InfoBlock
          title="Arquivo para análise"
          icon={<Icons.FileText size={16} className="icon--accent" />}
        >
          {file.name}
        </InfoBlock>
      );
    }
    
    if (!docSelecionado && !selectedModel && tool !== 1) {
      return <h3 className="info-block__placeholder">Nenhuma seleção ativa</h3>;
    }

    // Retorna um espaçador para manter a altura da barra consistente
    return <div className="info-block__placeholder--spacer" />;
  };

  return (
    <div className="action-bar">
      <div className="action-bar__info">
        {renderInfoContent()}
      </div>

      <div className="action-bar__actions">
        <button
          className="btn-mini"
          title="Iniciar nova análise"
          onClick={() => {
            setDocSelecionado(null);
            setTool(1);
          }}
        >
          <Icons.Add size={20} />
        </button>

        <button
          className="btn-mini"
          title="Iniciar bot"
          onClick={() => {
            setTool(4);
          }}
        >
          <Icons.Bot size={20} />
        </button>

        <button
          className="btn-mini"
          title="Mais opções"
          onClick={() => setMore(!more)}
        >
          <Icons.MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

export default ActionBar;