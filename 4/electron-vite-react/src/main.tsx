import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./samples/node-api";
import "./index.css";
import "./prosemirror.css";
import "remixicon/fonts/remixicon.css";
import Theme from "./theme/Theme";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <Theme dataTheme="dark">
      <App />
    </Theme>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
