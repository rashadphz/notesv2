import React from "react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import "../styles/globals.css";
import "../styles/prosemirror.css";
import "remixicon/fonts/remixicon.css";
import EditorContext from "../EditorContext";
import { Editor } from "@tiptap/react";
import { initEditor } from "../components/Editor";

export const inter = Inter({
  variable: "--font-default",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  const editor = initEditor();
  return (
    <main className={inter.className}>
      <EditorContext.Provider value={editor}>
        <Component {...pageProps} />
      </EditorContext.Provider>
    </main>
  );
}

export default MyApp;
