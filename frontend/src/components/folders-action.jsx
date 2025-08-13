import { useState } from "react";
import { FaRegFolder } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineDocumentText } from "react-icons/hi";
import SearchBar from "./searchbar";
import { HiArrowLeftEndOnRectangle } from "react-icons/hi2";
import { motion } from "framer-motion";
import { LuFileSearch } from "react-icons/lu";

function FoldersAction({ pastas, atualizarCaminho }) {
  const [pastasAtivas, setPastasAtivas] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [reduzido, setReduzido] = useState(false);

  const handleClique = (id) => {
    setPastasAtivas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleReducao = () => {
    setReduzido((prev) => !prev);
  };

  const pastasFiltradas = pastas.filter((pasta) =>
    pasta.text.toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <div style={{ display: "flex", gap: 16 }}>
        {/* Painel de Pastas animado e reduzível */}
        <motion.div
          className="Pastas"
          animate={{ width: reduzido ? 40 : 320 }}
          transition={{ duration: 0.3 }}
          style={{
            overflow: "hidden",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          <div
            className="slide-folder"
            style={{
              display: "flex",
              justifyContent: reduzido ? "center" : "space-between",
              alignItems: "center",
              padding: "8px",
            }}
          >
            {!reduzido && <h3>Visualizar pastas</h3>}
            <HiArrowLeftEndOnRectangle
              size={20}
              className="icons"
              onClick={toggleReducao}
              style={{ cursor: "pointer" }}
              title={reduzido ? "Expandir" : "Reduzir"}
            />
          </div>

          {!reduzido && (
            <>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              <div
                className="folders"
                style={{ overflowY: "auto", maxHeight: 400 }}
              >
                {pastasFiltradas.map((pasta) => (
                  <div key={pasta.id} className="folder-container">
                    <div className="flex-left-right folder">
                      <div
                        className="bf-left-f"
                        onClick={() => atualizarCaminho(pasta.text, "Pastas")}
                        style={{ cursor: "pointer" }}
                      >
                        <FaRegFolder size={20} className="icons" />
                        <h3>{pasta.text}</h3>
                      </div>

                      <div
                        className="icon"
                        onClick={() => handleClique(pasta.id)}
                        role="button"
                        aria-label="abrir/fechar subpasta"
                      >
                        {pastasAtivas[pasta.id] ? (
                          <IoIosArrowUp size={20} className="icons" />
                        ) : (
                          <IoIosArrowDown size={20} className="icons" />
                        )}
                      </div>
                    </div>

                    {pastasAtivas[pasta.id] && (
                      <div className="documents">
                        <HiOutlineDocumentText size={20} className="icons" />
                        <h3>Documentos</h3>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Conteúdo independente, sempre visível, não afetado pelo slide */}
      </div>

      <div className="middle-area">
        <div className="AnalisaArquivos">
          <LuFileSearch size={30} className="icons" />
          <h2>Analisador de arquivos</h2>
          {/* Seu conteúdo adicional aqui */}
        </div>
      </div>
    </>
  );
}

export default FoldersAction;
