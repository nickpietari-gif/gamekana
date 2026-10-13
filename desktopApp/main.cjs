const { app, BrowserWindow, ipcMain, net, protocol } = require('electron');
const { createProgressStore } = require('./progress-store.cjs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

protocol.registerSchemesAsPrivileged([{
  scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true }
}]);

let windowRef;
let progressStore;

function trusted(event) {
  const expected = 'app://bundle/index.html';
  if (event.sender !== windowRef?.webContents || event.senderFrame?.url !== expected) {
    throw new Error('Untrusted IPC sender');
  }
}

function createWindow() {
  windowRef = new BrowserWindow({
    width: 1120, height: 800, minWidth: 760, minHeight: 620,
    title: 'Hiragana Aero',
    backgroundColor: '#101f37',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  windowRef.loadURL('app://bundle/index.html');
  windowRef.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  windowRef.webContents.on('will-navigate', (event) => event.preventDefault());
}

app.whenReady().then(() => {
  progressStore = createProgressStore(path.join(app.getPath('userData'), 'progress.exploration.v1.json'));
  const root = path.resolve(__dirname, '..');
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    if (url.host !== 'bundle' || url.search || url.hash) {
      return new Response('Not found', { status: 404 });
    }
    let relative;
    try {
      relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    } catch {
      return new Response('Invalid path', { status: 400 });
    }
    const allowed = relative === 'index.html' || relative === 'shared/src/style.css' || relative.startsWith('dist/');
    const location = path.resolve(root, relative);
    const within = path.relative(root, location);
    if (!allowed || !within || within.startsWith('..') || path.isAbsolute(within)) {
      return new Response('Not found', { status: 404 });
    }
    return net.fetch(pathToFileURL(location).toString());
  });
  ipcMain.handle('progress:load', (event) => {
    trusted(event);
    return progressStore.load();
  });
  ipcMain.handle('progress:save', (event, value) => {
    trusted(event);
    return progressStore.save(value);
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
