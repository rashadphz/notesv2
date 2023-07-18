import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  Note,
  fetchNotes,
  noteSelectors,
  selectNote,
} from "@/redux/slices/noteSlice";
import React, { useEffect } from "react";
import noteSlice from "@/redux/slices/noteSlice";

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
  const selectedNote = useReduxSelector(
    (state) => state.notes.selectedNote
  );
  const allNotes = useReduxSelector(noteSelectors.selectAll);
  const dispatch = useReduxDispatch();

  useEffect(() => {
    const promise = dispatch(fetchNotes());
    return () => {
      promise.abort();
    };
  }, []);

  const changeSelectedNote = (note: Note) => {
    dispatch(
      selectNote({
        id: note.id,
      })
    );
  };

  return (
    <div>
      <div className="flex flex-col">
        {allNotes.map((note) => {
          const isSelected = selectedNote?.id === note.id;
          return (
            <div
              key={note.id}
              className={`m-2 rounded-lg ${
                isSelected ? "bg-neutral-focus" : ""
              }`}
              onClick={() => changeSelectedNote(note)}
            >
              <SidebarNote {...note} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
