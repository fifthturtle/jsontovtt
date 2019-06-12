const { app, BrowserWindow } = require('electron');

function createWindow()
{
    let win = new BrowserWindow({
        width : 786,
        height : 380,
        resizable : false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('gui/index.html');
}

app.on('ready', createWindow);