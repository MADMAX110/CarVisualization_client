const { app, BrowserWindow } = require('electron')
const ws = require("ws");
const fs = require("fs");
const wss = new ws.Server({ port: 1234 });

let dir = "C:/CarVisualization";
fs.access(dir, err => {
  if (err) { 
    fs.mkdir(dir, err => {
      if (err) throw err;
      console.log('Directory created');
    });
  } else {
    console.log('Directory exists');
  }
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`)
    try {
      var data = JSON.parse(message);
      if (data.type == "status") {
        fs.writeFile(dir + '/status.json', message, (err) => {
          if (err) throw err
        })
      } else if (data.type == "car_view") {
        fs.writeFile(dir + '/car_view.json', message, (err) => {
          if (err) throw err
        })
      } else {
        fs.writeFile(dir + '/others.json', message, (err) => {
          if (err) throw err
        })
      }
    } catch (e) {
      console.log('Error parsing JSON: ' + e.message);
    }
  })
})

// 需在当前文件内开头引入 Node.js 的 'path' 模块
const path = require('path')

// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  win.loadFile('html/index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})