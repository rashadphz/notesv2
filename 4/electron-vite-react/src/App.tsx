import { Resizable } from "re-resizable";
import EditorContext from "./EditorContext";
import NotesEditor, { initEditor } from "./components/editor";
import { Titlebar } from "./components/titlebar";
import Sidebar from "./components/sidebar";
import { useEffect } from "react";

function App() {
  const editor = initEditor();

  return (
    editor && (
      <div className="h-screen">
        <EditorContext.Provider value={editor}>
          <Titlebar />
          <div className="main-content flex bg-base-100 text-base-content">
            <Resizable
              className="h-full overflow-y-scroll border-r-[2px] border-base-300"
              defaultSize={{ width: 200, height: "100%" }}
              minWidth={200}
              maxWidth={400}
            >
              <Sidebar />
            </Resizable>
            <div className="w-3/4 h-full overflow-y-scroll">
              <NotesEditor />
            </div>
          </div>
        </EditorContext.Provider>
      </div>
    )
  );
}

export default App;
