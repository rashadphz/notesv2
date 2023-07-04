import React from "react";
import Head from "next/head";
import Link from "next/link";
import NotesEditor from "../components/Editor";
import { Titlebar } from "../components/Titlebar";
import nightwind from "nightwind/helper";
import Sidebar from "../components/Sidebar";
import { Resizable } from "re-resizable";

function Home() {
  return (
    <div className="bg-white h-screen">
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: nightwind.init() }}
        />
      </Head>
      <Titlebar />
      <div className="main-content flex">
        <Resizable
          className="h-full overflow-y-scroll border-r-[1px] border-r-slate-100 dark:border-r-slate-700"
          defaultSize={{ width: 200, height: "100%" }}
          minWidth={200}
          maxWidth={400}
        >
          <Sidebar />
        </Resizable>
        <div className="w-3/4 h-full overflow-y-scroll">
          <NotesEditor />
        </div>
      </div>
    </div>
  );
}

export default Home;
