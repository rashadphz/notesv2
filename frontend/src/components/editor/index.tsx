import { Editor as CoreEditor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { TipTapExtensions } from "./extensions";
import { TipTapProps } from "./props";
import EditorContext from "@/EditorContext";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { saveNoteAsync } from "@/redux/slices/noteSlice";
import { EditorState } from "@tiptap/pm/state";
import { EditorBubbleMenu } from "./bubbleMenu";
import { debounce } from "lodash";

export const initEditor = () => {
  const dispatch = useReduxDispatch();
  const selectedNote = useReduxSelector(
    (state) => state.notes.selectedNote
  );

  useEffect(() => {}, [selectedNote]);

  const debouncedSave = useCallback(
    debounce((note) => {
      dispatch(saveNoteAsync(note));
    }, 1000),
    []
  );

  return useEditor({
    onUpdate: ({ editor }) => {
      if (!selectedNote) return;

      const markdown = editor.storage.markdown.getMarkdown();
      debouncedSave({ ...selectedNote, content: markdown });
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
    <div className="pb-20 relative w-full h-[90%] p-4 px-8 sm:px-12">
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesEditor;
