const { app, BrowserWindow, Menu } = require('electron')

const url = require('url')
const path = require('path')

if(process.env.NODE_ENV !== 'production'){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', 'bin', 'electron')
  })
}


let mainWindow
let createNewProductWindow

app.on('ready', () => {
  
  mainWindow = new BrowserWindow({})
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/views/index.html'),
    protocol: 'file',
    slashes: true
  }))

  const mainMenu = Menu.buildFromTemplate(templateMenu)
  Menu.setApplicationMenu(mainMenu)
})

function createNewProduct() {
  createNewProductWindow = new BrowserWindow ({
    width: 400,
    height: 320,
    title: 'Add a new product'
  })

  createNewProductWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/views/new-product.html'),
    protocol: 'file',
    slashes: true
  }))

}

const templateMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New product',
        accelerator: 'Ctrl+N',
        click() {
          createNewProduct()
        }
      }
    ]
  }
]