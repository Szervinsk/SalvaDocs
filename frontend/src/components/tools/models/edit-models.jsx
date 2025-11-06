import "./EditModels.css";
import { useRef, useState, useEffect } from "react"; // Importe o useEffect
import { AREA_OPTIONS } from "../../../constants/constants";

// Componentes filhos
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

function EditModels({ modelos, tags, pastas, onDataChange, showAlert, documentos, handleScrollTo, modelosRef, tagsRef, pastasRef }) {
  const [activeOption, setActiveOption] = useState("Modelos"); // Inicia no Modelos
  
  // Crie uma ref para o container de rolagem
  const scrollContainerRef = useRef(null);

  // Efeito para observar a rolagem
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Mapeia as refs (que vêm do Block.jsx) para os seus nomes
    const sectionMapping = [
      { ref: modelosRef, name: "Modelos" },
      { ref: tagsRef, name: "Tags" },
      { ref: pastasRef, name: "Pastas" }
    ];

    // O observer callback é disparado quando uma seção entra/sai da "mira"
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Encontra o nome da seção que acabou de entrar na mira
          const visibleSection = sectionMapping.find(s => s.ref.current === entry.target);
          if (visibleSection) {
            setActiveOption(visibleSection.name);
          }
        }
      });
    };

    // Cria o observer
    const observer = new IntersectionObserver(observerCallback, {
      root: container, // A rolagem acontece dentro deste elemento
      // Define a "mira" como uma linha horizontal no meio da tela
      // O item é "ativo" quando passa por 50% da altura do container
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0
    });

    // Coloca o observer para "assistir" cada seção
    sectionMapping.forEach(s => {
      if (s.ref.current) {
        observer.observe(s.ref.current);
      }
    });

    // Limpa o observer quando o componente é desmontado
    return () => {
      sectionMapping.forEach(s => {
        if (s.ref.current) {
          observer.unobserve(s.ref.current);
        }
      });
    };
  // Roda o efeito sempre que as refs mudarem
  }, [modelosRef, tagsRef, pastasRef, scrollContainerRef]);


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

      <div className="models-scroll-container" ref={scrollContainerRef}>

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
          <TagsManager 
            tags={tags} 
            onDataChange={onDataChange} 
            showAlert={showAlert} 
          />
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