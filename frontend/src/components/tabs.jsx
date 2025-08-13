import { useState } from "react";
import { FaRegFolder } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlineDataUsage } from "react-icons/md";

function Tags({ key, tag, onSelecionarCaminho, onVoltar }) {
  const [ativo, setAtivo] = useState(false);

  const iconsMap = {
    1: FaRegFolder,
    2: MdOutlineDataUsage,
    3: RiAccountCircleLine,
  };

  const Icon = iconsMap[key];
  const isPastas = ["Pastas", "Obter Dados", "Sua Conta"].includes(tag.text);

  const handleClique = () => {
    if (isPastas) {
      const abrir = !ativo;
      setAtivo(abrir);
      if (abrir) {
        onSelecionarCaminho?.(null, tag.text); // seleciona raiz
      } else {
        onVoltar?.(); // volta um nível
      }
    }
  };

  return (
    <div className="flex-top-down">
      <div
        className="flex-left-right tags"
        onClick={handleClique}
        style={{ cursor: isPastas ? "pointer" : "default" }}
      >
        <div className="bf-left">
          {Icon && <Icon size={20} className="icons" />}
          <h3>{tag.text}</h3>
        </div>
      </div>
    </div>
  );
}

export default Tags;
