import { useState, useEffect } from "react";
import Folders from "./folders";
import { FaRegFolder } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlineDataUsage } from "react-icons/md";


function BigFolders({ type, searchQuery, forcarAbertura, onSelecionarCaminho, onVoltar }) {
  const [ativo, setAtivo] = useState(false);

  const conteudoPastas = {
    1: ["Despachos", "Pareceres", "Programas de Integridade"],
    2: ["Analisar arquivos", "Visualizar modelos"],
    3: ["Token de acesso", "Configurações"],
  };

  const isPastas = ["Pastas","Obter Dados","Sua Conta"];

  // Abre automaticamente ao digitar (só para Pastas)
  useEffect(() => {
    if (forcarAbertura) {
      setAtivo(true);
      if (onSelecionarCaminho) onSelecionarCaminho(null, type.text); // seleciona raiz
    } else {
      setAtivo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcarAbertura, type.text]);

  const handleClique = () => {
    // Só toggla e altera o caminho se for Pastas (ou se for um botão que você queira tratar)
    if (isPastas) {
      const abrir = !ativo;
      setAtivo(abrir);
      if (abrir) {
        if (onSelecionarCaminho) onSelecionarCaminho(null, type.text); // seleciona raiz
      } else {
        if (onVoltar) onVoltar(); // volta um nível
      }
    } else {
      // se quiser que outros tipos disparem algo, trate aqui (hoje são "botões")
    }
  };

  // aplica filtro apenas na Pastas
  const subpastas = conteudoPastas[type.id] || [];
  const subpastasFiltradas =
    isPastas && searchQuery
      ? subpastas.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
      : subpastas;

  // exibe: se for Pastas, mostra somente se houver match ou se não houver busca. Outros tipos sempre exibem.
  const deveExibir = !isPastas || searchQuery === "" || subpastasFiltradas.length > 0 || type.text.toLowerCase().includes(searchQuery.toLowerCase());
  if (!deveExibir) return null;

  return (
    <div className="flex-top-down">
      <div className="flex-left-right big-folder">
        <div className="bf-left" onClick={handleClique} style={{ cursor: isPastas ? "pointer" : "default" }}>
          {type.text === "Pastas" && (<FaRegFolder size={20} className="icons"/>)}
          {type.text === "Obter Dados" && (<MdOutlineDataUsage size={20} className="icons"/>)}
          {type.text === "Sua Conta" && (<RiAccountCircleLine size={20} className="icons"/>)}
          <h3>{type.text}</h3>
        </div>

        {isPastas && (
          <div className="icon-arrow" onClick={handleClique} role="button" aria-label="abrir/fechar pasta">
            {ativo ? <IoIosArrowUp size={20} className="icons" /> : <IoIosArrowDown size={20} className="icons" />}
          </div>
        )}
      </div>

      {isPastas && ativo && subpastasFiltradas && (
        <div className="conteudo-expandido">
          {subpastasFiltradas.map((item, index) => (
            <Folders
              key={index}
              text={item}
              onSelecionarCaminho={(sub) => onSelecionarCaminho && onSelecionarCaminho(sub, type.text)} // passa root
              onVoltar={onVoltar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BigFolders;
