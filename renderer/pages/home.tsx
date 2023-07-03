import React from "react";
import Head from "next/head";
import Link from "next/link";
import NotesEditor from "../components/Editor";
import { Titlebar } from "../components/Titlebar";
import nightwind from "nightwind/helper";

function Home() {
  return (
    <div className="bg-white h-screen">
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: nightwind.init() }}
        />
      </Head>
      <Titlebar />
      <div className="main-content">
        <NotesEditor />
      </div>
    </div>
  );
}

export default Home;
