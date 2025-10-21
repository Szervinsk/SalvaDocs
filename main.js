const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const dotenv = require('dotenv');

let backendProcess;

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app/backend/src/server.js')
    : path.join(__dirname, 'backend/src/server.js');
  
  const envPath = app.isPackaged 
    ? path.join(process.resourcesPath, 'app/backend/.env')
    : path.join(__dirname, 'backend/.env');
  
  const envVars = dotenv.config({ path: envPath }).parsed || {};
  const userDataPath = app.getPath('userData');
  const dbStoragePath = path.join(userDataPath, 'database.sqlite');

  console.log(`[Electron Main] Iniciando backend em: ${backendPath}`);
  console.log(`[Electron Main] Caminho do DB a ser usado: ${dbStoragePath}`);

  // Inicia o processo filho
  backendProcess = fork(backendPath, [], {
    env: { ...process.env, ...envVars, DB_STORAGE_PATH: dbStoragePath },
    //  AJUSTE PRINCIPAL: Captura a saída do processo filho 
    silent: true // Impede que o filho escreva diretamente no console, para podermos capturar
  });
  
  // CAPTURA E EXIBE O CONSOLE.LOG DO BACKEND 
  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend STDOUT]: ${data.toString()}`);
  });

  // CAPTURA E EXIBE O CONSOLE.ERROR DO BACKEND (O MAIS IMPORTANTE!)
  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend STDERR]: ${data.toString()}`);
  });

  backendProcess.on('exit', (code) => console.log(`[Electron Main] Processo do Backend finalizado com código: ${code}`));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 940,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "assets/icon.png"),
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "frontend/build/index.html"));
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});
