import { Resizable } from "re-resizable";
import EditorContext from "./EditorContext";
import NotesEditor, { initEditor } from "./components/editor";
import Sidebar from "./components/sidebar";
import { useEffect, useState } from "react";
import { FloatingMenuBar } from "./components/titlebar/floatingMenuBar";
import clsx from "clsx";

interface ButtonProps {
  onClick: () => void;
}

const CollapseSidebarButton = ({ onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 hover:bg-base-300 no-drag rounded-md m-2 mt-2"
    >
      <i className="text-2xl ri-arrow-left-double-line"></i>
    </button>
  );
};

const OpenSidebarButton = ({ onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 hover:bg-base-300 no-drag rounded-md m-2 mt-2"
    >
      <i className="text-2xl ri-arrow-right-double-line"></i>
    </button>
  );
};

function App() {
  const editor = initEditor();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const sideBarTransitionClass = clsx({
    "transition-all duration-300 z-10 max-w-[400px]": true,
    "w-0": !sidebarVisible,
    "w-[200px]": sidebarVisible,
  });

  const mainContentTransitionClass = clsx({
    "transition-all duration-300": true,
  });

  return (
    editor && (
      <EditorContext.Provider value={editor}>
        <div className="h-screen w-screen flex ">
          <div
            className={`h-full flex-initial overflow-hidden ${sideBarTransitionClass} bg-base-200`}
          >
            {/* <Resizable
              className={`h-full`}
              defaultSize={{ width: 200, height: "100%" }}
              minWidth={200}
              maxWidth={400}
            > */}
            <div className="flex justify-end items-center h-[37px] bg-base-200 drag">
              <CollapseSidebarButton
                onClick={() => setSidebarVisible(false)}
              />
            </div>
            <Sidebar />
            {/* </Resizable> */}
          </div>

          <div
            className={`h-screen overflow-y-scroll w-full max-w-[70ch] mx-auto ${mainContentTransitionClass}`}
          >
            <div className="flex items-center h-[37px] bg-base-100 drag">
              <div className="pl-[73px] pr-[10px] flex items-center h-[37px] bg-base-100 drag " />

              {!sidebarVisible && (
                <OpenSidebarButton
                  onClick={() => setSidebarVisible(true)}
                />
              )}
            </div>

            <NotesEditor />
            <div className="w-full relative ">
              <div className="absolute mx-auto bottom-[1.5rem] left-0 right-0 w-[360px]">
                <FloatingMenuBar />
              </div>
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    )
  );
}

export default App;
