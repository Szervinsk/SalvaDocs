import "./managements.css";
import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icons } from "../../../constants/icons";
import { AREA_OPTIONS } from "../../../constants/constants";

// Componentes filhos
import Tables from "./tables";
import ObjectEditor from "./ObjectEditor";

// Componente de navegação superior
export const SegmentedControl = ({
  options,
  activeOption,
  setActiveOption,
  onSelect,
}) => (
  <div className="segmented-control">
    {options.map((option) => (
      <button
        key={option.value}
        className={`segmented-control__button ${
          activeOption === option.value ? "active" : ""
        }`}
        onClick={() => {
          onSelect(option.value);
          setActiveOption(option.value);
        }}
      >
        {option.icon}
        {option.label}
      </button>
    ))}
  </div>
);

// Componente principal que gerencia as abas
function EditManager({
  modelos,
  tags,
  pastas,
  onDataChange,
  showAlert,
  documentos,
  handleScrollTo,
  modelosRef,
  tagsRef,
  pastasRef,
  // Removido dashboardRef, pois você indicou que não existe mais
}) {
  const [activeOption, setActiveOption] = useState("Modelos"); // Inicia em Modelos
  const [editorState, setEditorState] = useState(null);
  const scrollContainerRef = useRef(null);

  // Efeito para observar a rolagem e atualizar a aba ativa
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sectionMapping = [
      { ref: modelosRef, name: "Modelos" },
      { ref: tagsRef, name: "Tags" },
      { ref: pastasRef, name: "Pastas" },
    ];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibleSection = sectionMapping.find(
            (s) => s.ref.current === entry.target
          );
          if (visibleSection) {
            setActiveOption(visibleSection.name);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      rootMargin: "-50% 0px -50% 0px", // Mira no meio da tela
      threshold: 0,
    });

    sectionMapping.forEach((s) => {
      if (s.ref.current) {
        observer.observe(s.ref.current);
      }
    });

    return () => {
      sectionMapping.forEach((s) => {
        if (s.ref.current) {
          observer.unobserve(s.ref.current);
        }
      });
    };
  }, [modelosRef, tagsRef, pastasRef]); // Dependências corretas

  const handleSelectForEdit = (type, data = null) => {
    setEditorState({
      type,
      data,
      mode: data ? "edit" : "create",
    });
  };

  const closeEditor = () => setEditorState(null);

  const panelVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  return (
    <main className="manager-page">
      <aside
        // ✨ CORREÇÃO: 'ref' removida daqui. O <aside> não rola.
        className={`manager-sidebar ${editorState ? "shrunk" : "expanded"}`}
      >
        <div className="manager-sidebar-header">
          <header className="manager-header">
            <h1>Gerenciamento</h1>
            <p className="manager-subtitle">Modelos, Tags e Pastas</p>
          </header>

          <div className="manager-tabs">
            <SegmentedControl
              options={AREA_OPTIONS}
              activeOption={activeOption}
              setActiveOption={setActiveOption}
              onSelect={handleScrollTo}
            />
          </div>
        </div>

        {/* ✨ CORREÇÃO: 'ref' aplicada APENAS ao container que rola */}
        <div className="manager-scroll-container" ref={scrollContainerRef}>
          <section ref={modelosRef} className="models-section">
            <h2 className="models-section__title">Modelos</h2>
            <Tables
              activeTab="Modelos"
              modelos={modelos}
              onEdit={handleSelectForEdit}
              onDelete={onDataChange}
              showAlert={showAlert}
            />
          </section>

          <section ref={tagsRef} className="models-section">
            <h2 className="models-section__title">Tags</h2>
            <Tables
              activeTab="Tags"
              tags={tags}
              onEdit={handleSelectForEdit}
              onDelete={onDataChange}
              showAlert={showAlert}
            />
          </section>

          <section ref={pastasRef} className="models-section">
            <h2 className="models-section__title">Pastas</h2>
            <Tables
              activeTab="Pastas"
              pastas={pastas}
              onEdit={handleSelectForEdit}
              onDelete={onDataChange}
              showAlert={showAlert}
            />
          </section>
        </div>
      </aside>

      <AnimatePresence>
        {editorState && (
          <motion.section
            key={editorState.type}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="manager-editor-panel"
          >

            <ObjectEditor
              editorState={editorState}
              key={editorState.type + (editorState.data?.id || "create")}
              onClose={closeEditor}
              onSave={() => {
                onDataChange();
              }}
              showAlert={showAlert}
              tags={tags}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default EditManager;
