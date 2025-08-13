import "./styles/global.css";
import Navbar from "./components/navbar";
import ActionBlock from "./pages/actionBlock/ActionBlock";
import UrlText from "./components/url";
import { useState } from "react";

function Abas() {
  // Agora path é um objeto, cada chave é uma "raiz" ou seção
  const [paths, setPaths] = useState({});

  const tags = [
    { id: 1, text: "Pastas" },
    { id: 2, text: "Obter Dados" },
    { id: 3, text: "Sua Conta" },
  ];

  const pastas = [
    { id: 1, text: "Despachos" },
    { id: 2, text: "Pareceres" },
    { id: 3, text: "Programas de Integridade" },
  ];

  // Atualiza o path para uma raiz específica (ex: "Pastas")
  const atualizarCaminho = (novoItem, root) => {
    if (!root) return;

    setPaths((prev) => {
      const atual = prev[root] || [root];

      if (novoItem == null) {
        // Resetar para raiz apenas
        return { ...prev, [root]: [root] };
      }

      if (atual[atual.length - 1] === novoItem) {
        return prev; // sem mudança
      }

      return { ...prev, [root]: [...atual, novoItem] };
    });
  };

  // Voltar um nível em uma raiz específica
  const voltarUmNivel = (root) => {
    setPaths((prev) => {
      const atual = prev[root];
      if (!atual || atual.length <= 1) return prev;

      const novoPath = atual.slice(0, -1);

      return { ...prev, [root]: novoPath };
    });
  };

  return (
    <div className="main-container">
      <UrlText />
      <div className="main-container-little">
        <Navbar
          tags={tags}
          userReferences={{ empresa: "Empresa", funcao: "estagiário" }}
          onSelecionarCaminho={atualizarCaminho}
          onVoltar={(root) => voltarUmNivel(root)}
        />
        <ActionBlock
          paths={paths}
          types={tags}
          pastas={pastas}
          atualizarCaminho={atualizarCaminho}
          voltarUmNivel={voltarUmNivel}
        />
      </div>
    </div>
  );
}

export default Abas;
