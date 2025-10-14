import { Icons } from "../../constants/icons";
import { motion } from "framer-motion";
import "./alerts.css"; // Crie um arquivo CSS para ele

function Alerts({ type = "info", message, onClose }) {
  const alertVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const ICONS = {
    success: <Icons.CheckCircle size={20} />,
    error: <Icons.CloseCircle size={20} />,
    warning: <Icons.AlertTriangle size={20} />, // Supondo que você tenha este ícone
    info: <Icons.Info size={20} />, // Supondo que você tenha este ícone
  };

  return (
    <motion.div
      className={`alert-wrapper ${type}`}
      variants={alertVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="alert-icon">
        {ICONS[type]}
      </div>
      <p className="alert-message">{message}</p>
      <button className="alert-close-btn" onClick={onClose}>
        <Icons.Close size={18} />
      </button>
    </motion.div>
  );
}

export default Alerts;