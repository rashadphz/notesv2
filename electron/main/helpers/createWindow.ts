import {
  BrowserWindowConstructorOptions,
  BrowserWindow,
  shell,
  screen,
} from "electron";
import { url } from "inspector";
import { join } from "path";
import { update } from "../update";
import Store from "electron-store";

function createWindow(
  windowName: string,
  preload: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow {
  const key = "window-state";
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width || 800,
    height: options.height || 600,
  };
  let state = {};
  let win: BrowserWindow | null = null;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = (win: BrowserWindow) => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState: any, bounds: any) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState: any) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = (win: BrowserWindow) => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition(win));
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  win = new BrowserWindow({
    title: "Main",
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    trafficLightPosition: {
      x: 20,
      y: 20,
    },
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.on("close", () => {
    saveState(win!);
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // Apply electron-updater
  update(win);
  return win;
}

export default createWindow;
