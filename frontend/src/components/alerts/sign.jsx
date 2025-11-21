import { useState } from "react";
import { Icons } from "../../constants/icons"
import { motion, AnimatePresence } from "framer-motion";
import "./Welcome.css"; // Crie este novo arquivo CSS

// Dados dos passos do tour de boas-vindas
const welcomeSteps = [
  {
    step: 1,
    icon: <Icons.ScannerDocument size={48} />,
    title: "Bem-vindo ao SalvaDocs!",
    description: "Sua plataforma inteligente para transformar documentos em dados estruturados. Vamos fazer um tour rápido para você começar."
  },
  {
    step: 2,
    icon: <Icons.Model size={48} />,
    title: "Entendendo os Modelos e Tags",
    description: "Pense em um Modelo como um formulário (ex: 'Contrato' ou 'Parecer'). As Tags são os campos ou informações que você quer preencher nesse formulário (ex: 'Nº do Processo', 'Data de Assinatura') para que nós possamos identificar para você no documento. Ou seja, você define o que procurar, e nós encontramos para você."
  },
  {
    step: 3,
    icon: <Icons.Key size={48} />,
    title: "O Poder da Inteligência Artificial",
    description: "Para extrair dados complexos como resumos, conclusões ou signatários, o SalvaDocs utiliza a IA do Google Gemini. Para ativar essa funcionalidade avançada, você precisará configurar sua própria chave de API."
  },
  {
    step: 4,
    icon: <Icons.Adjustments size={48} />,
    title: "Controle Total no Seu Painel",
    description: "Na área de 'Gerenciamento', você tem total liberdade. Crie `Modelos` do zero, adicione `Tags` personalizadas com Regex ou IA, e organize tudo em `Pastas`. A plataforma se adapta ao seu fluxo de trabalho."
  },
  {
    step: 5,
    icon: <Icons.Check size={48} />,
    title: "Tudo Pronto para Começar!",
    description: "Agora você já sabe o básico! Explore a plataforma livremente ou vá para a sua conta para configurar sua chave de API e desbloquear todo o poder da IA."
  },
];

function Welcome({ onFinish, goToAccount }) {
  const [step, setStep] = useState(1);

  const currentStepData = welcomeSteps.find(s => s.step === step);
  const totalSteps = welcomeSteps.length;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    }
  };

  const handleGoToAccount = () => {
    goToAccount();
    onFinish();
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="welcome-overlay">
      <motion.div
        className="welcome-modal"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="welcome-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="welcome-step"
            >
              <div className="welcome-step__icon">{currentStepData.icon}</div>
              <h2 className="welcome-step__title">{currentStepData.title}</h2>
              <p className="welcome-step__description">{currentStepData.description}</p>

              {step === 3 && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn"
                >
                  <Icons.Question size={14} /> Como obter uma chave de API?
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="welcome-footer">
          <div className="progress-dots">
            {welcomeSteps.map(s => (
              <div key={s.step} className={`dot ${step >= s.step ? 'active' : ''}`}></div>
            ))}
          </div>
          <div className="welcome-nav">
            {step === totalSteps ? (
              <>
                <button className="btn-secondary" onClick={onFinish}>Explorar depois</button>
                <button className="btn-primary" onClick={handleGoToAccount}>
                  <Icons.User size={16} /> Ir para Minha Conta
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={handleNext}>
                Próximo <Icons.ArrowRight size={16} />
              </button>
            )}
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

export default Welcome;