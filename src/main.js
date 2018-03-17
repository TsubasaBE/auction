const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin;
let presentationWin;

// The main window menu
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {role: 'quit'}
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'}
        ]
    }
];


function createMainWindow () {
    // Load the previous state with fallback to defaults
    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    // Create the browser window.
    mainWin = new BrowserWindow({
        'show': false,
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        'icon': path.join(__dirname, './webapp/img/icons/primary-auction-64px.png')
    });

    // and load the index.html of the app.
    mainWin.loadURL(url.format({
        pathname: path.join(__dirname, './webapp/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Let us register listeners on the window, so we can update the state
    // automatically (the listeners will be removed when the window is closed)
    // and restore the maximized or full screen state
    mainWindowState.manage(mainWin);

    // Open the DevTools.
    mainWin.webContents.openDevTools({ mode: 'bottom' });

    mainWin.setMenu( Menu.buildFromTemplate(mainMenuTemplate) );

    // Emitted when the window is closed.
    mainWin.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWin = null
    });

    mainWin.once('ready-to-show', () => {
        mainWin.show();
        createPresentationWindow();
    })
}

function createPresentationWindow () {
    // Load the previous state with fallback to defaults
    let presentationWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    // Create the browser window.
    presentationWin = new BrowserWindow({
        'show': false,
        'x': presentationWindowState.x,
        'y': presentationWindowState.y,
        'width': presentationWindowState.width,
        'height': presentationWindowState.height,
        'autoHideMenuBar': true,
        'icon': path.join(__dirname, './webapp/img/icons/primary-auction-64px.png')
        // 'parent': mainWin
    });

    // and load the index.html of the app.
    presentationWin.loadURL(url.format({
        pathname: path.join(__dirname, './webapp/presentationWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Let us register listeners on the window, so we can update the state
    // automatically (the listeners will be removed when the window is closed)
    // and restore the maximized or full screen state
    presentationWindowState.manage(presentationWin);

    // Open the DevTools.
    presentationWin.webContents.openDevTools({ mode: 'bottom' });

    presentationWin.setMenu( Menu.buildFromTemplate(mainMenuTemplate) );

    // Emitted when the window is closed.
    presentationWin.on('close', (e) => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        console.log("Oopsie daisy!")
        // e.preventDefault();
    });

    presentationWin.once('ready-to-show', () => {
        presentationWin.show();
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createMainWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    };
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWin === null) {
        createMainWindow();
    }
    if (presentationWin === null) {
        createPresentationWindow();
    }
});




ipcMain.on("updatePresentationWindow", (event, form) => {
    console.log(form);

    presentationWin.webContents.send('updateLabels', form);
});

