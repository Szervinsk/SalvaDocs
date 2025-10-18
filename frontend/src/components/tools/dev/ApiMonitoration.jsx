import { useState } from "react";
import { Icons } from "../../../constants/icons";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import "./ApiMonitoration.css"; // Crie este novo arquivo CSS

// --- Sub-componente para uma linha de requisição ---
const ApiRequestRow = ({ method, path, onRun, response }) => {
  const formatJson = (data) => {
    try {
      return JSON.stringify(data, null, 2); // Formata o JSON com 2 espaços de indentação
    } catch {
      return "Erro ao formatar JSON.";
    }
  };

  return (
    <div className="request-card">
      <div className="request-info">
        <span className={`method-badge method--${method.toLowerCase()}`}>{method}</span>
        <code className="request-path">{path}</code>
        <button className="btn-secondary" onClick={onRun} disabled={response?.loading}>
          {response?.loading ? "Executando..." : <><Icons.Send size={14} /> Executar</>}
        </button>
      </div>

      <AnimatePresence>
        {response && !response.loading && (
          <motion.div
            className="response-area"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="response-header">
              <span className={`status-badge status--${response.status >= 400 ? 'error' : 'success'}`}>
                Status: {response.status}
              </span>
              <span className="response-time">
                <Icons.Clock size={14} /> {response.time}ms
              </span>
            </div>
            <pre className="response-body">
              <code>{formatJson(response.data)}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Componente Principal ---
const ApiMonitoration = ({ baseURL }) => {
  const [responses, setResponses] = useState({});

  const apiEndpoints = [
    { name: 'documentos', method: 'GET', path: `/files/documentos` },
    { name: 'pastas', method: 'GET', path: `/folders` },
    { name: 'modelos', method: 'GET', path: `/modelos` },
    { name: 'tags', method: 'GET', path: `/tags` },
  ];

  const handleRunRequest = async (endpoint) => {
    // 1. Define o estado de loading para a requisição específica
    setResponses(prev => ({ ...prev, [endpoint.name]: { loading: true, data: null, status: null, time: null } }));
    const startTime = Date.now();

    try {
      // 2. Faz a chamada à API
      const response = await axios({
        method: endpoint.method,
        url: endpoint.path,
      });
      const endTime = Date.now();

      // 3. Atualiza o estado com a resposta de sucesso
      setResponses(prev => ({
        ...prev,
        [endpoint.name]: {
          loading: false,
          data: response.data,
          status: response.status,
          time: endTime - startTime,
        }
      }));

    } catch (error) {
      const endTime = Date.now();
      console.error(`Erro ao executar requisição para ${endpoint.path}:`, error);

      // 4. Atualiza o estado com a resposta de erro
      setResponses(prev => ({
        ...prev,
        [endpoint.name]: {
          loading: false,
          data: error.response?.data || { error: error.message },
          status: error.response?.status || 500,
          time: endTime - startTime,
        }
      }));
    }
  };

  return (
    <div className="api-monitor-page">
      <header className="api-monitor-header">
        <h1>Monitor de APIs</h1>
        <p>Execute e visualize as respostas das principais rotas GET do sistema em tempo real.</p>
      </header>

      <div className="request-list">
        {apiEndpoints.map(endpoint => (
          <ApiRequestRow
            key={endpoint.name}
            method={endpoint.method}
            path={endpoint.path}
            onRun={() => handleRunRequest(endpoint)}
            response={responses[endpoint.name]}
          />
        ))}
      </div>
    </div>
  );
};

export default ApiMonitoration;