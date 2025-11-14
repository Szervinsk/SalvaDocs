import "./managements.css";
import { useRef, useState, useEffect } from "react";
import { AREA_OPTIONS } from "../../../constants/constants";
import { motion, AnimatePresence } from "framer-motion"; 

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
}) {
  const [activeOption, setActiveOption] = useState("Modelos");
  const [editorState, setEditorState] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // ... (lógica do IntersectionObserver mantida) ...
  }, [modelosRef, tagsRef, pastasRef, scrollContainerRef]);

  const handleSelectForEdit = (type, data = null) => {
    setEditorState({
      type,
      data,
      mode: data ? "edit" : "create",
    });
  };

  const handleCloseEditor = () => {
    setEditorState(null);
  };

  const panelVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  return (
    <main className="manager-page">
      {/* COLUNA DA ESQUERDA: Listas e Navegação */}
      <aside className={`manager-sidebar ${editorState ? "shrunk" : ""}`}>
        <header className="manager-header">
          <div>
            <h1>Gerenciamento</h1>
            <p>Configure os recursos do sistema.</p>
          </div>
        </header>

        <div className="manager-tabs">
          <SegmentedControl
            options={AREA_OPTIONS}
            activeOption={activeOption}
            setActiveOption={setActiveOption}
            onSelect={handleScrollTo}
          />
        </div>

        <div className="manager-content" ref={scrollContainerRef}>
          <Tables
            activeTab={activeOption} // Usa a aba ativa correta
            modelos={modelos}
            tags={tags}
            pastas={pastas}
            onEdit={handleSelectForEdit}
            onDelete={onDataChange}
            showAlert={showAlert}
          />
        </div>
      </aside>

      <AnimatePresence>
        {editorState && (
          <motion.section
            className="manager-editor-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }} // Curva de "ease" suave
          >
            <ObjectEditor
              editorState={editorState}
              onClose={handleCloseEditor}
              onSave={() => {
                onDataChange();
              }}
              showAlert={showAlert}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default EditManager;
