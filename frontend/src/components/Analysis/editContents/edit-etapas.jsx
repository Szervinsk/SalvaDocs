import { Icons } from "../../../constants/icons";
import { motion } from "framer-motion";

function EditEtapas({ etapas, etapaAtual, isEtapaDisabled, handleClick }) {
  const getStatus = (etapaId) => {
    if (etapaId < etapaAtual) return "completed";
    if (etapaId === etapaAtual) return "active";
    return "upcoming";
  };

  const ICONS = {
    1: <Icons.Tags size={20} />,
    2: <Icons.Upload size={20} />,
    3: <Icons.TextSearch size={20} />,
  };

  return (
    <div className="etapas-sidebar">
      <div className="etapas-header">
        <h4>Etapas da Análise</h4>
      </div>
      <div className="stepper-container">
        {(etapas || []).map((etapa, index) => {
          const status = getStatus(etapa.id);
          const disabled = isEtapaDisabled(etapa.id);

          return (
            <div key={etapa.id} className={`step-item ${status} ${disabled ? "disabled" : ""}`}>
              {/* Linha de conexão (não aparece no último item) */}
              {index < etapas.length - 1 && <div className="step-connector"></div>}
              
              <div className="step-icon-wrapper" onClick={() => handleClick(etapa.id)}>
                <motion.div whileHover={{ scale: 1.1 }} className="step-icon">
                  {status === 'completed' ? <Icons.Check size={20} /> : ICONS[etapa.id]}
                </motion.div>
              </div>

              <div className="step-content" onClick={() => handleClick(etapa.id)}>
                <h5>{etapa.text}</h5>
                <p>{etapa.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EditEtapas;