import { useState } from "react";
import { motion } from "framer-motion";

import { HiArrowLeftEndOnRectangle } from "react-icons/hi2";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaRegFolder } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import Logo from "../assets/pen.svg";
import SearchBar from "../components/searchbar";

function FoldersAction({ pastas, atualizarCaminho }) {
  const [pastasAtivas, setPastasAtivas] = useState({});
  const [reduzido, setReduzido] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    <motion.div
      className={`Pastas ${reduzido ? "reduzido" : ""}`}
      animate={{ width: reduzido ? 60 : 320 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo e nome */}
      <div className="flex-left-right businessCard">
        <div className="icon-pen">
          <img src={Logo} alt="Ícone" />
        </div>
        <div className="flex-top-down conteudo-colapsavel">
          <h2>Empresa</h2>
          <h3>sla</h3>
        </div>
      </div>

      {/* Botão de colapsar */}
      <div
        className="slide-folder"
        style={{
          display: "flex",
          justifyContent: reduzido ? "center" : "space-between",
          alignItems: "center",
          padding: "8px",
        }}
      >
        {!reduzido && (
          <h3 className="conteudo-colapsavel">Visualizar pastas</h3>
        )}
        <HiArrowLeftEndOnRectangle
          size={20}
          className="icons"
          onClick={toggleReducao}
          style={{ cursor: "pointer" }}
          title={reduzido ? "Expandir" : "Reduzir"}
        />
      </div>

      {/* Barra de busca */}
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
  );
}

export default FoldersAction;
