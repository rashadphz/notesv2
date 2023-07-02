import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import React from "react";
import { TipTapExtensions } from "../ui/editor/extensions";
import { TipTapProps } from "../ui/editor/props";

const NotesEditor = () => {
  const editor = useEditor({
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
      <pre><code class="language-css">body {
  display: none;
}</code></pre>
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

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg p-12 px-8 sm:pb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesEditor;
