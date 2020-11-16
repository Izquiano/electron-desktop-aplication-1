const { app, BrowserWindow, Menu, ipcMain } = require("electron");

const url = require("url");
const path = require("path");

const isMac = process.platform === "darwin";

if (process.env.NODE_ENV !== "production") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", "bin", "electron"),
  });
}

let mainWindow;
let newProductWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    title: "Main window",
    webPreferences: {
      nodeIntegration: true
  }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/views/index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.on("closed", () => {
    app.quit();
  });
});

function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    width: 400,
    height: 320,
    title: "Add a new product",
    webPreferences: {
      nodeIntegration: true
  }
  });
  // newProductWindow.setMenu(null);

  newProductWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/views/new-product.html"),
      protocol: "file",
      slashes: true,
    })
  );

  newProductWindow.on("close", () => {
    newProductWindow = null;
  });
}


ipcMain.on('product:new', (e, newProduct) => {
  // console.log(newProduct)
  mainWindow.webContents.send('product:new', newProduct)
  newProductWindow.close()
})

const templateMenu = [
  {
    label: "Products",
    submenu: [
      {
        label: "New product",
        accelerator: isMac ? "command+N" : "Ctrl+N",
        click() {
          createNewProductWindow();
        },
      },
      { type: 'separator' },
      {
        label: "Remove all products",
        click() {
          mainWindow.webContents.send('products:remove-all')
        }
      },
    ],
  },
];

if (isMac) {
  templateMenu.unshift({
    label: app.getName(),
    submenu: [
      {
        label: "Exit",
        accelerator: isMac ? "command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  });
}

if(process.env.NODE_ENV !== 'production'){
  templateMenu.push({
    label: 'DevTools',
    
    submenu: [
      {
        label: 'Show/Hide Dev Tools',
        accelerator: isMac ? "command+D" : "Ctrl+D",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}