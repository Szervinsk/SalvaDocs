import { useState } from "react";
import { PASTAS } from "../../constants/constants";
import { Icons } from "../../constants/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../../styles/home.css";
import { motion } from "framer-motion";

function Home({ documentos, searchQuery }) {

  const [reduzido, setReduzido] = useState(null);

  // dados agregados por pasta
  const pastaData = PASTAS.map((pasta) => ({
    name: pasta.name,
    value: documentos.filter((doc) => pasta.name === doc.model).length,
  }));

  // cores para os gráficos
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
    "#FF69B4",
  ];

  // barra lateral
  const toggleReducao = () => setReduzido((prev) => !prev);

  return (
    <div className="flex-left-right , spc-bet" style={{ height: "100%" }}>
      <main className="home">
        <div className="welcome">
          <h2>Olá usuário,</h2>
          <h3>Estas são suas estatísticas</h3>
        </div>

        <div className="docs-container">
          {/* Lista de pastas com contagem */}
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

          {/* Seção dos gráficos */}
          <div className="flex-left-right">
            <div className="block-content" style={{ width: "50%" }}>
              <header
                className="flex-left-right spc-bet"
                style={{ marginBlock: "10px" }}
              >
                <div className="flex-left-right">
                  <Icons.Graphics size={20} />
                  <h2 className="title-graphics">Distribuição por pastas</h2>
                </div>
                <button className="action-big-btns" style={{ width: "40%" }}>
                  Detalhes
                </button>
              </header>

              <div>
                <h3 style={{ fontSize: "14px" }}>
                  TOTAL DE DOCUMENTOS: {documentos.length}
                </h3>

                <hr />
                {documentos.length < 1 ? (
                  <p>Não foi possível encontrar documentos.</p>
                ) : (
                  <div className="charts-box">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pastaData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {pastaData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="block-content" style={{ width: "50%" }}>
              <header
                className="flex-left-right spc-bet"
                style={{ marginBlock: "10px" }}
              >
                <div className="flex-left-right">
                  <Icons.Graphics size={20} />
                  <h2 className="title-graphics">Comparativo entre pastas</h2>
                </div>
                <button className="action-big-btns" style={{ width: "40%" }}>
                  Detalhes
                </button>
              </header>

              {/* Barras */}
              <div className="chart-box">
                <hr />
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={pastaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="list-documents">
            <header>
              <h3>Documentos</h3>
            </header>

            <h3>aqui vai ficar a lista de documentos</h3>
          </div>
        </div>
      </main>

             <motion.div
      className={`lateral-bar ${reduzido ? "reduzido" : ""}`}
      animate={{ width: reduzido ? 80 : 280 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header da Lateral Bar */}
      <div className="lateral-bar-header">
        {!reduzido && <h3>Barra lateral</h3>}
        <Icons.BackIn
          size={20}
          className="icon-btn"
          onClick={toggleReducao}
          title={reduzido ? "Expandir" : "Reduzir"}
        />
      </div>   
      </motion.div>
    </div>
  );
}

export default Home;
