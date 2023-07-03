import { EditorContent } from "@tiptap/react";
import React from "react";
import { useEditor } from "../hooks/useEditor";

const NotesEditor = () => {
  const editor = useEditor();
  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg p-12 px-8 sm:pb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesEditor;
