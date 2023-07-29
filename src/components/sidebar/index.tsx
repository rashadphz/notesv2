import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  fetchNotes,
  noteSelectors,
  selectNote,
} from "@/redux/slices/noteSlice";
import React, { useEffect } from "react";
import CleaanBadge from "../CleaanBadge";
import { random } from "lodash";
import { Note } from "electron/preload/api/typeorm/entity/Note";
import moment from "moment";
import clsx from "clsx";
import { cn } from "@/utils";
import { useTheme } from "@/theme/useTheme";
moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dM",
    y: "a year",
    yy: "%dY",
  },
});

interface SidebarNoteProps extends Note {
  isSelected: boolean;
}
const SidebarNote = ({
  title,
  content: rawContent,
  updatedAt,
  tags,
  isSelected,
}: SidebarNoteProps) => {
  const { theme } = useTheme();
  const titleWeight = isSelected ? "font-bold" : "font-medium";
  const contentWeight = isSelected ? "font-medium" : "font-normal";

  const content = rawContent.replace(/[#*`]/g, "");

  const darkBadgeRed = clsx({
    "bg-red-400/10 text-red-400 ring-1 ring-inset ring-red-400/20":
      true,
  });
  const lightBadgeRed = clsx({
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10": true,
  });

  const badgeRed = theme === "dark" ? darkBadgeRed : lightBadgeRed;

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
        <p className={`text-xs line-clamp-1  ${contentWeight}`}>
          <span className="mr-1 text-base-content font-medium">
            {moment(updatedAt).fromNow(true)} -
          </span>
          <span className="text-base-content text-opacity-60">
            {content || "No content"}
          </span>
        </p>
        <div className="flex space-x-1">
          {tags.map((tag) => (
            <CleaanBadge
              key={tag.id}
              //   className={`text-xs bg-red-400/10 text-red-400 ring-1 ring-inset ring-red-400/20`}
              className={cn("text-xs", badgeRed)}
              //   className={`text-xs text-primary-content bg-primary`}
            >
              {tag.name}
            </CleaanBadge>
          ))}
        </div>
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
