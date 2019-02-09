import { setup, deleteLog, log } from 'electron-log-rotate';

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');

setup({
  appName: 'auction',  // required for directory name
  maxSize: (10 * 1024 * 1024),
});
// Remove logs older than 10 days
deleteLog(10);

log('[INFO] Auction Presenter application started.');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin;
let presentationWin;

// The main window menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
            { role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'window',
    submenu: [
            { role: 'minimize' },
    ],
  },
];

// Catch any unexpected error from the main process
process.on('uncaughtException', (e) => {
  const errorMessage = `[ERROR] MAIN ${e.message} => ${e.stack}`;
  log(errorMessage);
  dialog.showErrorBox('ERROR', errorMessage);
  log('[INFO] Quitting application due to error');
  app.quit();
});

function createPresentationWindow() {
  log('[INFO] Initializing presentation window');

  // Create the browser window.
  try {
    presentationWin = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      autoHideMenuBar: true,
      icon: path.join(__dirname, './webapp/img/icons/primary-auction-64px.png'),
      // 'parent': mainWin
    });

    log('[INFO] Loadig presentation window content');
    // and load the index.html of the app.
    presentationWin.loadURL(url.format({
      pathname: path.join(__dirname, './webapp/presentationWindow.html'),
      protocol: 'file:',
      slashes: true,
    }));

    // Open the DevTools.
    // presentationWin.webContents.openDevTools({ mode: 'bottom' });
    log('[INFO] Set presentation window menu');
    presentationWin.setMenu(Menu.buildFromTemplate(mainMenuTemplate));

    // Emitted when the window is closed.
    // presentationWin.on('close', (e) => {
    presentationWin.on('close', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      // console.log("Oopsie daisy!")
      log('[INFO] Closing presentation window');
      presentationWin = null;
    });

    presentationWin.once('ready-to-show', () => {
      log('[INFO] Showing presentation window');
      presentationWin.show();
    });
  } catch (e) {
    const errorMessage = `[ERROR] createPresentationWindow ${e.message} => ${e.stack}`;
    log(errorMessage);
    dialog.showErrorBox('ERROR', errorMessage);
    log('[INFO] Quitting application due to error');
    app.quit();
  }
}


function createMainWindow() {
  try {
    // Create the browser window.
    log('[INFO] Initialize main window');
    mainWin = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      icon: path.join(__dirname, './webapp/img/icons/primary-auction-64px.png'),
    });

    // and load the index.html of the app.
    log('[INFO] Loading main window content');
    mainWin.loadURL(url.format({
      pathname: path.join(__dirname, './webapp/index.html'),
      protocol: 'file:',
      slashes: true,
    }));

    // Open the DevTools.
    // mainWin.webContents.openDevTools({ mode: 'bottom' });
    log('[INFO] Set main window menu');
    mainWin.setMenu(Menu.buildFromTemplate(mainMenuTemplate));

    // Emitted when the window is closed.
    mainWin.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      log('[INFO] Closing main window');
      mainWin = null;
      if (mainWin !== null) {
        log('[INFO] Closing main window');
        mainWin = null;
      }
      if (presentationWin !== null) {
        log('[INFO] Closing presentation window');
        presentationWin = null;
      }
      log('[INFO] Quitting application');
      app.quit();
    });

    mainWin.once('ready-to-show', () => {
      log('[INFO] Showing main window');
      mainWin.show();
      if (presentationWin === null || typeof presentationWin === 'undefined') {
        createPresentationWindow();
      }
    });
  } catch (e) {
    const errorMessage = `[ERROR] createMainWindow ${e.message} => ${e.stack}`;
    log(errorMessage);
    dialog.showErrorBox('ERROR', errorMessage);
    log('[INFO] Quitting application due to error');
    app.quit();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createPresentationWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  log('[INFO] Quitting application');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (presentationWin === null || typeof presentationWin === 'undefined') {
    createPresentationWindow();
  }
});


ipcMain.on('updatePresentationWindow', (event, form) => {
  // console.log(presentationWin);

  if (presentationWin === null || typeof presentationWin === 'undefined') {
    createPresentationWindow();
  } else {
    log(`[INFO] Updating labels in presentation window => ${form.lotNr}: ${form.currency}${form.price}`);
    presentationWin.webContents.send('updateLabels', form);
  }
});

ipcMain.on('presentationWindowReady', () => {
  log('[INFO] Presentation window is ready');
  if (mainWin === null || typeof mainWin === 'undefined') {
    createMainWindow();
  }
});

ipcMain.on('logException', (event, emessage, estack) => {
  const errorMessage = `[ERROR] RENDERER ${emessage} => ${estack}`;
  log(errorMessage);
  dialog.showErrorBox('ERROR', errorMessage);
});
