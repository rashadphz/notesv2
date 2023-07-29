import { Fragment, useContext } from "react";
import EditorContext from "@/EditorContext";
import { useTheme } from "@/theme/useTheme";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  createNoteAsync,
  deleteNoteAsync,
} from "@/redux/slices/noteSlice";

interface MenuBarItem {
  icon: string;
  title: string;
  action: () => void;
  isActive: () => boolean;
  isDisabled: boolean;
}

const MenuItem = ({
  icon,
  title,
  action,
  isActive,
  isDisabled,
}: MenuBarItem) => {
  return (
    <>
      <style>{`
        .menuItem {
            -webkit-app-region: no-drag;
        }
      `}</style>
      <button
        className="menuItem rounded-md disabled:opacity-50 enabled:hover:bg-base-200 w-8 h-8 center"
        onClick={action}
        title={title}
        disabled={isDisabled}
      >
        <i className={`text-xl ri-${icon}`}></i>
      </button>
    </>
  );
};

export const MenuBar = () => {
  const { theme, setTheme } = useTheme();
  const editor = useContext(EditorContext);
  if (!editor) return null;

  const selectedNote = useReduxSelector(
    (state) => state.notes.selectedNote
  );

  const dispatch = useReduxDispatch();
  const leftItems: MenuBarItem[] = [
    {
      icon: "draft-line",
      title: "New Note",
      action: () => dispatch(createNoteAsync()),
      isActive: () => false,
      isDisabled: false,
    },
    {
      icon: "delete-bin-line",
      title: "Delete Note",
      action: () =>
        selectedNote
          ? dispatch(deleteNoteAsync(selectedNote.id))
          : null,
      isActive: () => false,
      isDisabled: false,
    },
  ];

  const rightItems: MenuBarItem[] = [
    {
      icon: "bold",
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      isDisabled: false,
    },
    {
      icon: "italic",
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      isDisabled: false,
    },
    {
      icon: "strikethrough",
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      isDisabled: false,
    },
    {
      icon: "moon-line",
      title: "Dark Mode",
      action: () => {
        setTheme(theme === "light" ? "dark" : "light");
      },
      isActive: () => false,
      isDisabled: false,
    },
  ];

  return (
    <div className="flex items-center justify-between h-full">
      <div className="space-x-2">
        {leftItems.map((item, index) => (
          <Fragment key={index}>
            <MenuItem {...item} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
