import { useState } from "react";
import Update from "@/components/update";
import logoVite from "./assets/logo-vite.svg";
import logoElectron from "./assets/logo-electron.svg";

console.log(
  "[App.tsx]",
  `Hello world from Electron ${process.versions.electron}!`
);

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center">
        Hello world!
      </h1>
      <Update />
    </div>
  );
}

export default App;
