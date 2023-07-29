import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./samples/node-api";
import "./index.css";
import "./prosemirror.css";
import "remixicon/fonts/remixicon.css";
import Theme from "./theme/Theme";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <Provider store={store}>
    <React.StrictMode>
      <Theme dataTheme="light">
        <App />
      </Theme>
    </React.StrictMode>
  </Provider>
);

postMessage({ payload: "removeLoading" }, "*");
