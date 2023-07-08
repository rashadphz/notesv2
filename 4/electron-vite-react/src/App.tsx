import { Resizable } from "re-resizable";
import EditorContext from "./EditorContext";
import NotesEditor, { initEditor } from "./components/editor";

console.log(
  "[App.tsx]",
  `Hello world from Electron ${process.versions.electron}!`
);

function App() {
  const editor = initEditor();
  return (
    <>
      <EditorContext.Provider value={editor}>
        <div className="main-content flex">
          <Resizable
            className="h-full overflow-y-scroll border-r-[1px] border-r-slate-100 dark:border-r-slate-700"
            defaultSize={{ width: 200, height: "100%" }}
            minWidth={200}
            maxWidth={400}
          >
            {/* <Sidebar /> */}
          </Resizable>
          <div className="w-3/4 h-full overflow-y-scroll">
            <NotesEditor />
          </div>
        </div>
        {/* <div>
          <h1 className="text-3xl font-bold underline text-center">
            Hello world!
          </h1>
          <Update />
        </div> */}
      </EditorContext.Provider>
    </>
  );
}

export default App;
