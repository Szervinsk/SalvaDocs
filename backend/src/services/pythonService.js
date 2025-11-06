import { spawn } from 'child_process';
import path from 'path';

// Determina se estamos rodando no executável Electron (produção)
const isPackaged = process.env.NODE_ENV === 'production' && process.execPath.endsWith('electron');

// Helper para determinar o caminho correto do script Python
function getScriptPath(scriptName) {
    if (isPackaged) {
        // Caminho em produção (dentro dos recursos empacotados)
        return path.join(process.resourcesPath, 'app/backend/bots', scriptName);
    }
    // Caminho em desenvolvimento
    return path.join(process.cwd(), '/bots', scriptName);
}

/**
 * Executa o script Python e retorna o resultado ou erro.
 * O script Python deve imprimir o status no STDOUT (ex: 'STATUS: SUCCESS - Mensagem').
 */
export async function runPythonBotFlow(username, password, url) {
    const scriptPath = getScriptPath('bot.py');
    // Você precisa ter o binário 'python' no PATH da máquina ou usar o caminho completo.
    // Em Electron empacotado, isso pode exigir o empacotamento do Python, 
    // mas vamos tentar usar o binário do sistema primeiro.
    const pythonExecutable = 'python'; 
    
    const args = [scriptPath, username, password, url];

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(pythonExecutable, args);
        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
            console.log(`[Python Bot]: ${data.toString().trim()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
            console.error(`[Python Error]: ${data.toString().trim()}`);
        });

        pythonProcess.on('close', (code) => {
            const output = stdout.trim();
            if (code !== 0) {
                // Falha na execução do script (erro de sintaxe, ou erro de driver)
                reject(new Error(`O bot falhou. Código: ${code}. Saída: ${output || stderr}`));
                return;
            }

            // Verifica se o bot retornou uma mensagem de sucesso
            if (output.includes('STATUS: SUCCESS')) {
                resolve(output);
            } else {
                // Se a execução foi 0, mas o bot não retornou SUCCESS, é um erro lógico interno
                reject(new Error(`Execução falhou. Verifique logs do bot. Saída: ${output}`));
            }
        });

        pythonProcess.on('error', (err) => {
            // Falha ao iniciar o binário Python (ex: Python não instalado)
            reject(new Error(`Falha ao iniciar o processo Python. Erro: ${err.message}`));
        });
    });
}