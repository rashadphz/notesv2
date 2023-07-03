import React from "react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import "../styles/globals.css";
import "../styles/prosemirror.css";
import "remixicon/fonts/remixicon.css";
import EditorContext from "../EditorContext";
import { initEditor } from "../components/Editor";
import { ThemeProvider } from "next-themes";

export const inter = Inter({
  variable: "--font-default",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  const editor = initEditor();

  return (
    <main className={inter.className}>
      <ThemeProvider
        attribute="class"
        storageKey="nightwind-mode"
        defaultTheme="system"
      >
        <EditorContext.Provider value={editor}>
          <Component {...pageProps} />
        </EditorContext.Provider>
      </ThemeProvider>
    </main>
  );
}

export default MyApp;
