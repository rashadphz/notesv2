import { Editor } from "@tiptap/react";
import React from "react";

const EditorContext = React.createContext<Editor | null>(null);

export default EditorContext;
