import "./styles/global.css";
import Navbar from "./components/navbar";
import ActionBlock from "./pages/actionBlock/ActionBlock";
import UrlText from "./components/url";
import { useState } from "react";

function Abas() {
  const [path, setPath] = useState([]); // começa vazio
  const [rootFolder, setRootFolder] = useState(null);

    const tabs = [
    { id: 1, text: "Pastas" },
    { id: 2, text: "Obter Dados" },
    { id: 3, text: "Sua Conta" },
  ];

  const pastas = [{ id: 1, text: "Despachos" },
    { id: 2, text: "Pareceres" },
    { id: 3, text: "Programas de Integridade" },]

  const atualizarCaminho = (novoItem, root) => {
    if (!root) return;

    if (novoItem == null) {
      // Clicou apenas na raiz
      setRootFolder(root);
      setPath([root]);
      return;
    }

    if (!rootFolder || rootFolder !== root) {
      // nova raiz
      setRootFolder(root);
      setPath([root, novoItem]);
    } else {
      // mesma raiz
      setPath((prev) => {
        if (prev[prev.length - 1] === novoItem) return prev;
        return [...prev, novoItem];
      });
    }
  };

  const voltarUmNivel = () => {
    setPath((prev) => {
      if (prev.length > 0) {
        const novo = prev.slice(0, -1);
        if (novo.length === 0) {
          // caminho zerado
          setRootFolder(null);
          return [];
        }
        if (novo.length === 1) {
          setRootFolder(novo[0]);
        }
        return novo;
      }
      return prev;
    });
  };

  return (
    <div className="main-container">
      <UrlText />
      <div className="main-container-little">
        <Navbar
          types={tabs}
          userReferences={{ empresa: "Empresa", funcao: "estagiário" }}
          onSelecionarCaminho={atualizarCaminho}
          onVoltar={voltarUmNivel}
        />
        <ActionBlock path={path} types={tabs} pastas={pastas}/>
      </div>
    </div>
  );
}

export default Abas;
