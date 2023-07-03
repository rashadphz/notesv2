import { EditorContent, useEditor } from "@tiptap/react";
import React, { useContext, useEffect } from "react";
import { TipTapExtensions } from "../ui/editor/extensions";
import { TipTapProps } from "../ui/editor/props";
import EditorContext from "../EditorContext";

export const initEditor = () => {
  return useEditor({
    extensions: TipTapExtensions,
    editorProps: TipTapProps,
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That’s a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
      </p>
      <pre><code class="language-python">def fib(n):
    return fib(n - 1) + fib(n - 2) if n > 1 else n
</code></pre>
      <p>
        I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
    `,
  });
};

const NotesEditor = () => {
  const editor = useContext(EditorContext);
  return (
    <div className="relative min-h-[500px] w-full p-12 px-8 sm:pb-[calc(20vh)] sm:rounded-lg sm:px-12 sm:shadow-lg">
      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesEditor;
