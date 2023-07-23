import { Resizable } from "re-resizable";
import EditorContext from "./EditorContext";
import NotesEditor, { initEditor } from "./components/editor";
import { Titlebar } from "./components/titlebar";
import Sidebar from "./components/sidebar";
import { useEffect } from "react";
import { FloatingMenuBar } from "./components/titlebar/floatingMenuBar";

function App() {
  const editor = initEditor();

  return (
    editor && (
      <div className="h-screen">
        <EditorContext.Provider value={editor}>
          <Titlebar />
          <div className="main-content flex text-base-content">
            <Resizable
              className="h-full overflow-y-scroll border-r-[1px] border-base-300 bg-base-200 shadow-inner"
              defaultSize={{ width: 200, height: "100%" }}
              minWidth={200}
              maxWidth={400}
            >
              <Sidebar />
            </Resizable>
            <div className="w-3/4 h-full overflow-y-scroll max-w-[90ch] mx-auto relative">
              <NotesEditor />
              <div className="absolute bottom-[1.5rem] right-[50%] translate-x-[50%]">
                <FloatingMenuBar />
              </div>
            </div>
          </div>
        </EditorContext.Provider>
      </div>
    )
  );
}

export default App;
