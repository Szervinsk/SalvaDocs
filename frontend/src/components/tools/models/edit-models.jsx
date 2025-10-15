import "./EditModels.css";
import { useState } from "react";
import { Icons } from "../../../constants/icons";

// Importando os componentes filhos que este arquivo gerencia
import Dashboard from "./dashboard";
import TagsManager from "./tagsManager";
import ModelsManager from "./modelsManager";
import PastasManager from "./pastasManager";

// Componente reutilizável para as abas de navegação
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

// Componente principal que gerencia as abas
function EditModels({ modelos, tags, pastas, onDataChange, showAlert, baseURL }) {
  const [area, setArea] = useState("dashboard");

  const areaOptions = [
    { label: "Dashboard", value: "dashboard", icon: <Icons.Graphics size={16} /> },
    { label: "Modelos", value: "models", icon: <Icons.Model size={16} /> },
    { label: "Tags", value: "tags", icon: <Icons.Tags size={16} /> },
    { label: "Pastas", value: "pastas", icon: <Icons.Folder size={16} /> },
  ];

  const renderArea = () => {
    switch (area) {
      case "tags":
        return <TagsManager tags={tags} onDataChange={onDataChange} showAlert={showAlert} baseURL={baseURL} />;
      case "models":
        return <ModelsManager modelos={modelos} tags={tags} onDataChange={onDataChange} showAlert={showAlert} baseURL={baseURL} />;
      case "pastas":
        return <PastasManager pastas={pastas} onDataChange={onDataChange} showAlert={showAlert} baseURL={baseURL} />;
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