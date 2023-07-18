import { Fragment, useContext } from "react";
import EditorContext from "@/EditorContext";
import { useTheme } from "@/theme/useTheme";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { createNote } from "@/redux/slices/noteSlice";

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
        className="menuItem p-2 rounded-md disabled:opacity-50 enabled:hover:bg-base-300 w-10 h-10 "
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

  const canCreateNewNote = useReduxSelector(
    (state) => state.notes.canCreateNewNote
  );
  const dispatch = useReduxDispatch();

  const items: MenuBarItem[] = [
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
    {
      icon: "draft-line",
      title: "New Note",
      action: () => dispatch(createNote()),
      isActive: () => false,
      isDisabled: !canCreateNewNote,
    },
  ];

  return (
    <div>
      {items.map((item, index) => (
        <Fragment key={index}>
          <MenuItem {...item} />
        </Fragment>
      ))}
    </div>
  );
};
