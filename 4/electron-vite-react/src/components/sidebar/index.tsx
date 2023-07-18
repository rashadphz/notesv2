import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  Note,
  fetchNotes,
  noteSelectors,
} from "@/redux/slices/noteSlice";
import React, { useEffect } from "react";

const SidebarNote = ({ title, content }: Note) => {
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
  const allNotes = useReduxSelector(noteSelectors.selectAll);
  const dispatch = useReduxDispatch();

  useEffect(() => {
    const promise = dispatch(fetchNotes());
    return () => {
      promise.abort();
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        {allNotes.map((note) => (
          <div key={note.id}>
            <SidebarNote {...note} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
