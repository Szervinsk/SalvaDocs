import { useState, useEffect, useCallback } from "react";
import { Icons } from "../../../constants/icons";
import axios from "axios";
import "./routes.css"; 

function Routes({ user, showAlert, onDataChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [botLogs, setBotLogs] = useState("Aguardando início da automação...");

  // ✨ CORREÇÃO 1: Função deve ser definida com useCallback para estabilidade ✨
  const handleStartRoute = useCallback(async () => {
    // 1. Validação de segurança básica
    if (!user || !user.username) {
      showAlert("Erro", "Usuário não autenticado. Faça login novamente.", "error");
      return;
    }

    setIsLoading(true);
    setBotLogs("Executando bot Python. Pode levar alguns segundos...");

    // ALERTA: O token JWT já é anexado automaticamente pelo interceptor do App.jsx.
    // Não precisa anexar no 'headers' novamente!
    // A rota /run-selenium deve ser /bot/run-selenium (dependendo do seu roteador).

    try {
      // 2. Chama a rota do backend que dispara o script Python
      const response = await axios.post('/bot/run-selenium', {
        // Em aplicações reais, você passaria as credenciais do usuário aqui:
        username: user.username,
        // Senha: (Seria buscada de um local seguro no backend, NÃO enviada pelo frontend!)
      });

      // 3. Sucesso
      const logs = response.data.output || response.data.logs || "Execução concluída sem logs detalhados.";
      setBotLogs(logs);
      showAlert("Sucesso", "Automação iniciada com sucesso! Verifique os logs.", "success");

      // Opcional: Chama onDataChange se a automação gerar novos documentos
      // onDataChange(); 

    } catch (error) {
      // 4. Erro
      const errorMessage = error.response?.data?.error || "Erro de conexão com o servidor Node.js.";
      setBotLogs(`ERRO: ${errorMessage}\n\nDetalhes: ${error.message}`);
      showAlert("Erro", errorMessage, "error");

    } finally {
      setIsLoading(false);
    }
  }, [user, showAlert]); // Depende do objeto user e showAlert

  // Ajuste de segurança: Garantir que o botão chama a função (sem parênteses)
  return (
    <div className="bot-monitor-container">
      <h3>Monitoramento de Automação</h3>
      <p>Área para iniciar o fluxo de pesquisa e filtros no sistema externo via bot Selenium.</p>

      <button
        className="btn-primary"
        onClick={handleStartRoute}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Icons.Spinner size={16} /> Executando Bot...
          </>
        ) : (
          <>
            <Icons.ArrowRight size={16} /> Iniciar Fluxo de Busca
          </>
        )}
      </button>

      <div className="log-area">
        <h4>Logs da Execução Python:</h4>
        <pre>{botLogs}</pre>
      </div>
    </div>
  );
}

export default Routes;