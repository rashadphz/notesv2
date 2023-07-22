import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  fetchNotes,
  noteSelectors,
  selectNote,
} from "@/redux/slices/noteSlice";
import React, { useEffect } from "react";
import { Note } from "knex/types/tables";
import CleaanBadge from "../CleaanBadge";
import { random } from "lodash";

interface SidebarNoteProps extends Note {
  isSelected: boolean;
}
const SidebarNote = ({
  title,
  content,
  isSelected,
}: SidebarNoteProps) => {
  const titleWeight = isSelected ? "font-bold" : "font-medium";
  const contentWeight = isSelected ? "font-medium" : "font-normal";

  return (
    <div
      className={`px-2 flex flex-col rounded-lg ${
        isSelected ? "bg-base-300" : ""
      }`}
    >
      <div className="py-3 space-y-1">
        <p className={`text-sm line-clamp-1 ${titleWeight}`}>
          {title || "New Note"}
        </p>
        {isSelected && (
          <div className="flex space-x-1">
            <CleaanBadge
              className={`text-xs text-secondary-content bg-primary`}
            >
              <text>hey</text>
            </CleaanBadge>
            <CleaanBadge
              className={`text-xs text-primary-content bg-primary`}
            >
              <text>👋🏿</text>
            </CleaanBadge>
          </div>
        )}
        {/* <p
          className={`text-xs line-clamp-1 opacity-50 ${contentWeight}`}
        >
          {content || "No content"}
        </p> */}
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
      <div className="flex flex-col bg-base-200">
        {allNotes.map((note) => {
          const isSelected = selectedNote?.id === note.id;
          return (
            <div
              key={note.id}
              className="mt-1 mx-2 rounded-2xl"
              onClick={() => changeSelectedNote(note)}
            >
              <SidebarNote {...note} isSelected={isSelected} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
