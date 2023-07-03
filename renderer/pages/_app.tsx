import React from "react";
import type { AppProps } from "next/app";
import { Inter, Fira_Code } from "next/font/google";

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

export const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  const editor = initEditor();

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
        code {
          font-family: ${firaCode.style.fontFamily};
        }
      `}</style>
      <main>
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
    </>
  );
}

export default MyApp;
