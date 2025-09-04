import { useState } from "react";
import { PASTAS } from "../../constants/constants";
import { Icons } from "../../constants/icons";
import "../../styles/home.css";
import { motion } from "framer-motion";
import SearchBar from "../bars/searchbar";

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    cx,
    cy,
    "L",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function Home({ documentos, modelos, user }) {
  const [reduzido, setReduzido] = useState(true);
  const [searchQuery, setSearchQuery] = useState(null);
  const [modelGraph, setModelGraph] = useState(null);
  const [stroke, setStroke] = useState(null);
  const [option, setOption] = useState(1);

  const handleMouseOver = (id) => {
    setModelGraph(id);
    setStroke(id);
  };
  // cores para os gráficos
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
    "#FF69B4",
  ];

  const HOME_TYPES = [
    { id: 1, name: "Acesso rápido", icon: undefined },
    { id: 2, name: "Gráficos", icon: undefined },
    { id: 3, name: "Listas", icon: undefined },
  ];

  // dados agregados por pasta
  const pastaData = PASTAS.map((pasta) => ({
    id: pasta.id,
    name: pasta.name,
    value: documentos.filter((doc) => pasta.name === doc.model).length,
  })).filter((p) => p.value > 0); // remove modelos sem documentos

  const total = pastaData.reduce((sum, p) => sum + p.value, 0);

  // modelo mais utilizado
  const maisUsado =
    pastaData.length > 0
      ? pastaData.reduce((a, b) => (a.value > b.value ? a : b)).name
      : "Nenhum";

  // barra lateral
  const toggleReducao = () => setReduzido((prev) => !prev);

  return (
    <div className="flex-left-right spc-bet" style={{ height: "100%" }}>
      <main className="home">
        {/* Boas-vindas */}
        <div className="welcome">
          <div className="account-img"></div>
          <h2>Olá {user.username}, tudo bem?</h2>
        </div>

        {/* Container de cards (gráficos) */}
        <div className="docs-container">
          {/* Gráfico total de envios */}
          <div>
            <div className="data-content">
              <header>
                <div className="flex-left-right">
                  <Icons.Graphics size={20} />
                  <h3>Total de envios</h3>
                </div>
                <button
                  className="action-big-btns"
                  style={{ width: "80px" }}
                  onClick={() => setReduzido(!reduzido)}
                >
                  Detalhes
                </button>
              </header>

              <div className="areas">
                <div>
                  <h2 className="text-area">
                    <span className="docs-length">{documentos.length}</span>
                    <br />
                    {documentos.length > 1
                      ? "documentos analisados"
                      : "documento analisado"}
                  </h2>
                </div>

                <div className="grafico-area">
                  {pastaData.map((item, index) => (
                    <div className="column-area" key={item.name}>
                      <div
                        className="column"
                        style={{
                          background: COLORS[index % COLORS.length],
                          height: `${item.value * 20}px`,
                        }}
                      ></div>
                      <h4>{item.value}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico de uso dos modelos (pizza manual) */}
            <div className="data-content">
              <header>
                <div className="flex-left-right">
                  <Icons.Graphics size={20} />
                  <h3>Uso dos modelos</h3>
                </div>
                <button
                  className="action-big-btns"
                  style={{ width: "80px" }}
                  onClick={() => setReduzido(!reduzido)}
                >
                  Detalhes
                </button>
              </header>

              <div className="areas">
                <div className="grafico-area">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    {(() => {
                      let currentAngle = 0;
                      const radius = 50;
                      const cx = 50;
                      const cy = 50;
                      return pastaData.map((item, index) => {
                        const sliceAngle = (item.value / total) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + sliceAngle;
                        currentAngle = endAngle;

                        return (
                          <path
                            key={item.id}
                            d={describeArc(
                              cx,
                              cy,
                              radius,
                              startAngle,
                              endAngle
                            )}
                            fill={COLORS[index % COLORS.length]}
                            stroke="#fff"
                            strokeWidth={`${stroke === item.id ? 2 : 6}`}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseLeave={() => handleMouseOver(null)}
                          />
                        );
                      });
                    })()}

                    {/* círculo branco no centro */}
                    <circle cx="50" cy="50" r="35" fill="#fff" />

                    {/* texto centralizado no círculo */}
                    <text
                      x="50"
                      y="55"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#000"
                      fontWeight="bold"
                    >
                      %
                    </text>
                  </svg>
                </div>

                <h2 className="text-area">
                  <span className="docs-length">
                    {modelGraph === 1 ? (
                      <>
                        <h3> modelo: Despacho</h3>
                        <h4>
                          {" "}
                          {
                            documentos.filter((doc) => doc.model === "Despacho")
                              .length
                          }{" "}
                          chamadas
                        </h4>
                      </>
                    ) : modelGraph === 2 ? (
                      <>
                        <h3> modelo: Parecer</h3>
                        <h4>
                          {" "}
                          {
                            documentos.filter((doc) => doc.model === "Parecer")
                              .length
                          }{" "}
                          chamadas
                        </h4>
                      </>
                    ) : modelGraph === 3 ? (
                      <>
                        <h3> modelo: Programas</h3>
                        <h4>
                          {" "}
                          {
                            documentos.filter(
                              (doc) => doc.model === "Programas"
                            ).length
                          }{" "}
                          chamadas
                        </h4>
                      </>
                    ) : (
                      <>
                        <h2>
                          <b style={{ color: "var(--second-color-blue)" }}>
                            {maisUsado}
                          </b>
                        </h2>
                        <h3>modelo mais usado</h3>
                        <h4>{PASTAS.length} Modelos adicionados</h4>
                      </>
                    )}
                  </span>
                  <br />
                </h2>
              </div>
            </div>
          </div>

          <div className="data-content" style={{ height: "370px" }}>
            <header>
              <div className="flex-left-right">
                <Icons.Graphics size={20} />
                <h3>Outro gráfico meu fi</h3>
              </div>
              <button
                className="action-big-btns"
                style={{ width: "80px" }}
                onClick={() => setReduzido(!reduzido)}
              >
                Detalhes
              </button>
            </header>
          </div>
        </div>

        {/* Tipos de coisa */}
        <div className="flex-left-right , spc-bet">
          <div className="flex-left-right">
            {HOME_TYPES.map((type) => (
              <div
                key={type.id}
                className="home-type"
                style={{
                  borderBottom:
                    option === type.id
                      ? "2px solid var(--second-color-blue)"
                      : "none",
                }}
              >
                <span onClick={() => setOption(type.id)}>{type.name}</span>
              </div>
            ))}
          </div>

          <div style={{ width: "40%" }}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder={"pesquisa ai"}
            />
          </div>
        </div>

        {option && option === 1 ? (
          <>
            <ul className="div-qtd-docs">
              {PASTAS.map((pasta) => (
                <li className="pasta-dashboard" key={pasta.id}>
                  <div>
                    <Icons.Folder
                      size={20}
                      className="icons"
                      style={{ marginLeft: "0" }}
                    />
                    <h3>{pasta.name}</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h1>
                      {
                        documentos.filter((doc) => pasta.name === doc.model)
                          .length
                      }
                    </h1>
                    {(() => {
                      const IconComponent = Icons[pasta.name];
                      return IconComponent ? (
                        <IconComponent
                          size={50}
                          className="icons-pasta-dashboard"
                        />
                      ) : null;
                    })()}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : option === 2 ? (
          <>
            <h3>aqui vão ficar os gráficos sla</h3>
          </>
        ) : (
          option === 3 && (
            <>
              <h3>aqui vão ficar as outras coisas sla</h3>
            </>
          )
        )}

        {/* Lista de documentos */}
        <div className="list-documents">
          <header>
            <h3>Documentos</h3>
          </header>
          <h3>aqui vai ficar a lista de documentos</h3>
        </div>
      </main>

      {/* Barra lateral animada */}
      <motion.div
        className={`lateral-bar ${reduzido ? "reduzido" : ""}`}
        animate={{ width: reduzido ? 80 : 280 }}
        transition={{ duration: 0.3 }}
      >
        <div className="lateral-bar-header">
          {!reduzido && <h3>Barra lateral de Detalhes</h3>}
          <Icons.BackIn
            size={20}
            className="icon-btn"
            onClick={toggleReducao}
            title={reduzido ? "Expandir" : "Reduzir"}
          />
        </div>

        <div>
          {!reduzido && <p>aqui vai ficar os detalhes da coisas cara</p>}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
