import "./EditModels.css";
import { useRef, useState } from "react";
import { AREA_OPTIONS } from "../../../constants/constants";

// Componentes filhos
import Dashboard from "./dashboard";
import TagsManager from "./tagsManager";
import ModelsManager from "./modelsManager";
import PastasManager from "./pastasManager";

// Componente de navegação superior
export const SegmentedControl = ({ options, activeOption, setActiveOption, onSelect }) => (
  <div className="segmented-control">
    {options.map((option) => (
      <button
        key={option.value}
        className={`segmented-control__button ${activeOption === option.value ? "active" : ""}`}
        onClick={() => { onSelect(option.value); setActiveOption(option.value) }}
      >
        {option.icon}
        {option.label}
      </button>
    ))}
  </div>
);

function EditModels({ modelos, tags, pastas, onDataChange, showAlert, documentos }) {
  const [activeOption, setActiveOption] = useState("Dashboard");

  const dashboardRef = useRef(null);
  const tagsRef = useRef(null);
  const modelosRef = useRef(null);
  const pastasRef = useRef(null);

  const handleScrollTo = (area) => {
    const refs = {
      Dashboard: dashboardRef,
      Tags: tagsRef,
      Modelos: modelosRef,
      Pastas: pastasRef,
    };
    const ref = refs[area];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="models-page">
      <header className="models-page__header">
        <h1>Painel de Gerenciamento</h1>
        <p>Gerencie, visualize e analise seus modelos, tags e pastas.</p>
      </header>

      <div className="models-page__tabs">
        <SegmentedControl
          options={AREA_OPTIONS}
          activeOption={activeOption}
          setActiveOption={setActiveOption}
          onSelect={handleScrollTo}
        />
      </div>

      <div className="models-scroll-container">
        {/* DASHBOARD */}
        <section ref={dashboardRef} className="models-section">
          <h2 className="models-section__title">Dashboard</h2>
          <Dashboard tags={tags} modelos={modelos} documentos={documentos} setArea={handleScrollTo} />
        </section>

        {/* MODELOS */}
        <section ref={modelosRef} className="models-section">
          <h2 className="models-section__title">Modelos</h2>
          <ModelsManager
            modelos={modelos}
            tags={tags}
            onDataChange={onDataChange}
            showAlert={showAlert}
          />
        </section>

        {/* TAGS */}
        <section ref={tagsRef} className="models-section">
          <h2 className="models-section__title">Tags</h2>
          <TagsManager tags={tags} onDataChange={onDataChange} showAlert={showAlert} />
        </section>

        {/* PASTAS */}
        <section ref={pastasRef} className="models-section">
          <h2 className="models-section__title">Pastas</h2>
          <PastasManager
            pastas={pastas}
            onDataChange={onDataChange}
            showAlert={showAlert}
            documentos={documentos}
          />
        </section>

      </div>
    </main>
  );
}

export default EditModels;
