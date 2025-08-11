import { useState } from "react";
import { FaRegFolder } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineDocumentText } from "react-icons/hi";

function Folders({ text, onSelecionarCaminho, onVoltar }) {
  const [ativo, setAtivo] = useState(false);

  const handleClique = () => {
    const abrindo = !ativo;
    // se for abrir, adiciona ao path; se for fechar, volta um nível
    if (abrindo) {
      if (onSelecionarCaminho) onSelecionarCaminho(text);
    } else {
      if (onVoltar) onVoltar();
    }
    setAtivo(abrindo);
  };

  return (
    <div className="flex-top-down">
      <div className="flex-left-right folder">
        <div className="bf-left-f">
          <FaRegFolder size={20} className="icons" />
          <h3>{text}</h3>
        </div>

        <div className="icon" onClick={handleClique} role="button" aria-label="abrir/fechar subpasta">
          {ativo ? <IoIosArrowUp size={20} className="icons" /> : <IoIosArrowDown size={20} className="icons" />}
        </div>
      </div>

      {ativo && (
        <div className="documents">
          <HiOutlineDocumentText size={20} className="icons" />
          <h3>Documentos</h3>
        </div>
      )}
    </div>
  );
}

export default Folders;
