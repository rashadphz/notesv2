import React from "react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import "../styles/globals.css";
import "../styles/prosemirror.css";

export const inter = Inter({
  variable: "--font-default",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
