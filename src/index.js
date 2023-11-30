const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: store.get('windowWidth') || 1366,
    height: store.get('windowHeight') || 768,
    minWidth: 600,
    minHeight: 300,
    icon: '/icons/icon.png',
    autoHideMenuBar: 'true',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#fff',
      symbolColor: '#000',
      height: 15
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  // Load the web client panel in the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Save the window resolution when it is resized.
  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowWidth', width);
    store.set('windowHeight', height);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
