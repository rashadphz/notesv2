import { EditorContent, useEditor } from "@tiptap/react";
import React, { useContext, useEffect } from "react";
import { TipTapExtensions } from "./extensions";
import { TipTapProps } from "./props";
import EditorContext from "@/EditorContext";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { saveNoteAsync } from "@/redux/slices/noteSlice";

export const initEditor = () => {
  const dispatch = useReduxDispatch();
  const selectedNote = useReduxSelector(
    (state) => state.notes.selectedNote
  );

  useEffect(() => {}, [selectedNote]);

  return useEditor({
    onUpdate: ({ editor }) => {
      if (!selectedNote) return;

      const markdown = editor.storage.markdown.getMarkdown();
      dispatch(saveNoteAsync({ ...selectedNote, content: markdown }));
    },
    extensions: TipTapExtensions,
    editorProps: TipTapProps,
    content: `## Hi There, \n this is a *basic* example of **tiptap**. Sure, there are all kind of basic text styles you’d probably expect from a text editor. \n But wait until you see the lists: - That’s a bullet list with one … - … or two list items.`,
  });
};

const NotesEditor = () => {
  const editor = useContext(EditorContext);
  const selectedNote = useReduxSelector(
    (state) => state.notes.selectedNote
  );

  useEffect(() => {
    if (selectedNote && editor) {
      editor.commands.setContent(selectedNote.content);
    }
  }, [editor, selectedNote]);

  return (
    <div className="pb-20 relative w-full p-12 px-8 sm:px-12">
      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesEditor;
