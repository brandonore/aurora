const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron
const{autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

/*---------------------------------------
* Auto-updater
* ---------------------------------------*/

// setup logger
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// setup updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available!');
  console.log('Version', info.version);
  console.log('Release date', info.releaseDate);
});

autoUpdater.on('update-not-available', () => {
  console.log('Update not available');
});

autoUpdater.on('download-progress', (progress) => {
  console.log(`Progress ${Math.floor(progress.percent)}`);
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  win.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
});

// log updater errors
autoUpdater.on('error', (error) => {
  console.error(error);
});

/*---------------------------------------
* App start
* ---------------------------------------*/

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 400, height: 200, frame: false, transparent: true})

  // load index.html for the app
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  // trigger update check
  if(!isDev) {
    autoUpdater.checkForUpdates();
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})