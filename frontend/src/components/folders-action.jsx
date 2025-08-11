import { useState } from "react";
import { FaRegFolder } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineDocumentText } from "react-icons/hi";

function FoldersAction({ pastas }) {
  // Estado que guarda quais pastas estão abertas, por id ou índice
  const [pastasAtivas, setPastasAtivas] = useState({});

  const handleClique = (id) => {
    setPastasAtivas((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle true/false
    }));
  };

  return (
    <div className="Pastas">
      {pastas.map((pasta) => (
        <div key={pasta.id} className="folder-container">
          <div className="flex-left-right folder">
            <div className="bf-left-f">
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
  );
}

export default FoldersAction;
