import "../../styles/global.css";
import Path from "../../components/path";
import Block from "../../components/block";
import FoldersAction from "../../components/folders-action";
import { useState } from "react";

function ActionBlock({ path, types, pastas, atualizarCaminho, voltarUmNivel}) {
  const [selectedModel, setSelectedModel] = useState(null); // estado do modelo selecionado
  const models = [
    { id: 1, text: "Despachos" },
    { id: 2, text: "Programas de Integridade" },
    { id: 3, text: "Pareceres" },
  ];

  return (
    <>
      <FoldersAction pastas={pastas} atualizarCaminho={atualizarCaminho} />

      <div className="background-block">
        <Path path={path} onVoltar={voltarUmNivel}/>
        <Block
          path={path}
          types={types}
          pastas={pastas}
          atualizarCaminho={atualizarCaminho}
          modelos={models}
          selectedModel={selectedModel}   // envia modelo selecionado
          setSelectedModel={setSelectedModel}
        />
      </div>
    </>
  );
}

export default ActionBlock;
