import "./styles/global.css";
import ActionBlock from "./pages/actionBlock/ActionBlock";
import UrlText from "./components/url";
import { useState } from "react";

function Abas() {
  const [path, setPath] = useState([]);

  const pastas = [
    { id: 1, text: "Despachos" },
    { id: 2, text: "Pareceres" },
    { id: 3, text: "Programas de Integridade" },
    { id: 4, text: "Outros Documentos" },
  ];

  const atualizarCaminho = (novoItem) => {
    setPath((prev) => [...prev, novoItem]);
  };

  const voltarUmNivel = () => {
    setPath((prev) => prev.slice(0, -1));
  };

  return (
    <div className="main-container">
      <UrlText />
      <div className="main-container-little">
        <ActionBlock
          path={path}
          pastas={pastas}
          atualizarCaminho={atualizarCaminho}
          voltarUmNivel={voltarUmNivel}
        />
      </div>
    </div>
  );
}

export default Abas;
