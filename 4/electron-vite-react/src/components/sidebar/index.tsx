import React from "react";

interface SidebarNoteProps {
  title: string;
  content: string;
}

const SidebarNote = ({ title, content }: SidebarNoteProps) => {
  return (
    <div className="px-5 flex flex-col">
      <div className="py-5 space-y-1">
        <p className="text-sm font-medium line-clamp-1">{title}</p>
        <p className="text-xs text-primary line-clamp-1">1d ago</p>
        <p className="text-xs text-neutral-content line-clamp-1">
          {content}
        </p>
      </div>
      <hr className="border-base-300" />
    </div>
  );
};

const Sidebar = () => {
  return (
    <div>
      <div className="flex flex-col">
        <SidebarNote
          title="Git Commands Cheatsheet"
          content="Why doesn’t printf scramble the text if they run at the same time?"
        />
        <SidebarNote
          title="JavaScript Functions"
          content="How to define and invoke functions in JavaScript?"
        />
        <SidebarNote
          title="CSS Box Model"
          content="What are the different components of the CSS box model?"
        />
        <SidebarNote
          title="Python Data Structures"
          content="What are the commonly used data structures in Python?"
        />
        <SidebarNote
          title="React Component Lifecycle"
          content="What are the different phases of a React component's lifecycle?"
        />
      </div>
    </div>
  );
};

export default Sidebar;
