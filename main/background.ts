import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { ipcMain, BrowserWindow } from "electron";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    trafficLightPosition: {
      x: 20,
      y: 20,
    },
  });

  ipcMain.on("minimizeApp", () => {
    mainWindow?.minimize();
  });
  ipcMain.on("maximizeApp", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on("closeApp", () => {
    mainWindow.close();
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
