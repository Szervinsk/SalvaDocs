import "./EditModels.css";
import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import axios from "axios";

// Importando os componentes filhos
import Dashboard from "./dashboard";
import TagsManager from "./tagsManager";
import ModelsManager from "./modelsManager";
import PastasManager from "./pastasManager";

// O SegmentedControl, como é usado aqui, pode ficar neste arquivo.
export const SegmentedControl = ({ options, activeOption, onSelect }) => (
  <div className="segmented-control">
    {options.map((option) => (
      <button
        key={option.value}
        className={`segmented-control__button ${activeOption === option.value ? "active" : ""}`}
        onClick={() => onSelect(option.value)}
      >
        {option.icon}
        {option.label}
      </button>
    ))}
  </div>
);

// ==========================================================================
// COMPONENTE PAI PRINCIPAL
// ==========================================================================
function EditModels({showAlert}) {
  const [area, setArea] = useState("dashboard");
  
  // Estados para armazenar os dados do banco
  const [tags, setTags] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [pastas, setPastas] = useState([]);

  // Efeito para buscar todos os dados iniciais da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, modelosRes, pastasRes] = await Promise.all([
          axios.get("http://localhost:5000/api/tags/"),
          axios.get("http://localhost:5000/api/modelos/"), 
          axios.get("http://localhost:5000/api/folders/"),
        ]);
        setTags(tagsRes.data);
        setModelos(modelosRes.data);
        setPastas(pastasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      }
    };

    fetchData();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const areaOptions = [
    { label: "Dashboard", value: "dashboard", icon: <Icons.Graphics size={16} /> },
    { label: "Modelos", value: "models", icon: <Icons.Model size={16} /> },
    { label: "Tags", value: "tags", icon: <Icons.Tags size={16} /> },
    { label: "Pastas", value: "pastas", icon: <Icons.Folder size={16} /> },
  ];

  // Função que decide qual componente filho renderizar
  const renderArea = () => {
    switch (area) {
      case "tags":
        return <TagsManager tags={tags} setTags={setTags} showAlert={showAlert} />;
      case "models":
        return <ModelsManager modelos={modelos} setModelos={setModelos} showAlert={showAlert} />;
      case "pastas":
        return <PastasManager pastas={pastas} setPastas={setPastas} showAlert={showAlert} />;
      case "dashboard":
      default:
        return <Dashboard tags={tags} modelos={modelos} />;
    }
  };

  return (
    <main className="models-page">
      <header className="models-page__header">
        <h1>Painel de Gerenciamento</h1>
        <p>Gerencie, visualize e analise seus modelos, tags e pastas.</p>
      </header>
      <div className="models-page__tabs">
        <SegmentedControl options={areaOptions} activeOption={area} onSelect={setArea} />
      </div>
      <div className="models-page__content">
        {renderArea()}
      </div>
    </main>
  );
}

export default EditModels;