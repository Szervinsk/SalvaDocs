import { useState } from "react";
import { PASTAS } from "../../../constants/constants";
import { Icons } from "../../../constants/icons";
import "./home.css";
import SearchBar from "../../bars/searchBar/searchbar";

// Funções auxiliares para gráficos de pizza
const polarToCartesian = (cx, cy, r, angle) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", cx, cy, "L", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y, "Z"].join(" ");
};

function Home({
  documentos,
  onClose,
  user,
  setDocSelecionado,
  docSelecionado,
  setDocumentos,
  setSelectedModel,
  setEtapaAtual,
  setTool,
  setBarraLateral,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modelGraph, setModelGraph] = useState(null);
  const [stroke, setStroke] = useState(null);
  const [option, setOption] = useState(1);

  const handleMouseOver = (id) => {
    setModelGraph(id);
    setStroke(id);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF69B4"];

  const HOME_TYPES = [
    { id: 1, name: "Acesso rápido", icon: <Icons.Adjustments size={16} /> },
    { id: 2, name: "Gráficos", icon: <Icons.Graphics size={16} /> },
    { id: 3, name: "Listas", icon: <Icons.Lamp size={16} /> },
  ];

  const handleDocumentClick = (doc) => {
    if (docSelecionado === doc) {
      setDocSelecionado(null);
      setBarraLateral(false);
      onClose(false);
    } else {
      setDocSelecionado(doc);
      setBarraLateral(false);
    }
  };

  // Dados agregados por pasta
  const pastaData = PASTAS.map((pasta) => ({
    id: pasta.id,
    name: pasta.name,
    value: documentos.filter((doc) => pasta.name === doc.model).length,
  })).filter((p) => p.value > 0);

  const total = pastaData.reduce((sum, p) => sum + p.value, 0);
  const maisUsado = pastaData.length ? pastaData.reduce((a, b) => (a.value > b.value ? a : b)).name : "Nenhum";
  const maxValue = pastaData.length ? Math.max(...pastaData.map((item) => item.value)) : 0;

  return (
    <div className="home">
      {/* Boas-vindas */}
      <div className="welcome">
        <div className="account-img"></div>
        <div>
          <h2>Olá {user.username}, tudo bem?</h2>
          <h3>Bem-vindo de volta ao painel</h3>
        </div>
      </div>

      <main>
        {/* Botões de opções e Search */}
        <div className="home-options">
          <div className="home-types">
            {HOME_TYPES.map((type) => (
              <div
                key={type.id}
                className={`home-type ${option === type.id ? "active" : ""}`}
                onClick={() => setOption(type.id)}
              >
                {type.icon}
                <span>{type.name}</span>
              </div>
            ))}
          </div>

          <div className="home-search">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Pesquisar documentos..." />
          </div>
        </div>

        {/* Opção 1: Acesso rápido */}
        {option === 1 && (
          // MODIFICAÇÃO: Container adicionado para o layout flex funcionar
          <div className="acesso-rapido-container"> 
            <div className="scroll">
              <div className="atalhos-container">
                <div className="atalho-card" onClick={() => setTool(3)}>
                  <Icons.Model size={32} />
                  <h3>Ver Modelos</h3>
                  <p>Explore todos os modelos disponíveis</p>
                </div>
                <div className="atalho-card" onClick={() => setTool(2)}>
                  <Icons.DocumentText size={32} />
                  <h3>Analisar Documentos</h3>
                  <p>Inicie uma nova análise</p>
                </div>
                <div className="atalho-card" onClick={() => { setTool(2); setEtapaAtual(1); setSelectedModel("Despacho"); }}>
                  <Icons.Folder size={32} />
                  <h3>Analisar modelo Despacho</h3>
                  <p>Use o modelo mais popular</p>
                </div>
                <div className="atalho-card" onClick={() => setTool(4)}>
                  <Icons.Adjustments size={32} />
                  <h3>Configurações</h3>
                  <p>Personalize sua experiência</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Atividade Recente</h3>
              <div className="activity-list">
                {documentos.slice(0, 3).map((doc, index) => {
                  const date = new Date(doc.createdAt);
                  const formattedDate = date.toLocaleDateString("pt-BR");
                  const formattedTime = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={index} className="activity-item">
                      <div className="activity-icon"><Icons.Archive size={16} /></div>
                      <div className="activity-content">
                        <p><strong>{doc.templateName}</strong> foi analisado</p>
                        <span>{formattedDate} às {formattedTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Opção 2: Gráficos */}
        {option === 2 && (
          <div className="charts-container">
            {/* Total de envios */}
            <div className="data-content">
              <header>
                <Icons.Graphics size={20} />
                <h3>Total de envios</h3>
              </header>
              <div className="areas">
                <h2 className="text-area">
                  <span className="docs-length">{documentos.length}</span> {documentos.length !== 1 ? "documentos analisados" : "documento analisado"}
                </h2>
                <div className="grafico-area">
                  {pastaData.map((item, index) => (
                    <div className="column-area" key={item.name}>
                      <div
                        className="column"
                        style={{
                          background: COLORS[index % COLORS.length],
                          height: maxValue ? `${(item.value / maxValue) * 70}px` : "0px",
                        }}
                        title={`${item.name}: ${item.value} documentos`}
                      ></div>
                      <h4>{item.value}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Uso dos modelos */}
            <div className="data-content">
              <header>
                <Icons.Graphics size={20} />
                <h3>Uso dos modelos</h3>
              </header>
              <div className="areas">
                <div className="grafico-area">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    {(() => {
                      let currentAngle = 0;
                      return pastaData.map((item, index) => {
                        const sliceAngle = total > 0 ? (item.value / total) * 360 : 0;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + sliceAngle;
                        currentAngle = endAngle;
                        return (
                          <path
                            key={item.id}
                            d={describeArc(50, 50, 50, startAngle, endAngle)}
                            fill={COLORS[index % COLORS.length]}
                            strokeWidth={stroke === item.id ? 2 : 6}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseLeave={() => handleMouseOver(null)}
                          />
                        );
                      });
                    })()}
                    <circle cx="50" cy="50" r="35" fill="var(--color-surface)" />
                    <text x="50" y="55" textAnchor="middle" fontSize="12" fill="var(--color-text-primary)" fontWeight="bold">%</text>
                  </svg>
                </div>

                <div>
                  {modelGraph ? (
                    <>
                      <h3>Modelo: {pastaData.find(p => p.id === modelGraph)?.name}</h3>
                      <h4>{pastaData.find(p => p.id === modelGraph)?.value} chamadas</h4>
                    </>
                  ) : (
                    <>
                      <h2><b style={{ color: "var(--color-accent)" }}>{maisUsado}</b></h2>
                      <h3>Modelo mais usado</h3>
                      <h4>{pastaData.length} modelos ativos</h4>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opção 3: Listas */}
        {option === 3 && (
          <div className="list-documents">
            <header>
              <h3>Documentos</h3>
              <span className="doc-count">{documentos.length} documentos</span>
            </header>
            <div className="table-container">
              <table className="documents-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Qtd Tags</th>
                    <th>Criado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((doc, index) => {
                    const date = new Date(doc.createdAt).toLocaleDateString("pt-BR");
                    return (
                      <tr key={index} onClick={() => handleDocumentClick(doc)}>
                        <td>{index + 1}</td>
                        <td className="doc-name">{doc.templateName}</td>
                        <td><span className="doc-category">{doc.model}</span></td>
                        <td><span className="tag-count">{doc.tags.length} tags</span></td>
                        <td>{date}</td>
                        <td>
                          <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleDocumentClick(doc); }} title="Ver detalhes">
                            <Icons.Add size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;