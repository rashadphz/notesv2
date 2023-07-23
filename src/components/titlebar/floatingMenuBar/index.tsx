import { Fragment, useContext } from "react";
import EditorContext from "@/EditorContext";
import { useTheme } from "@/theme/useTheme";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  createNoteAsync,
  deleteNoteAsync,
} from "@/redux/slices/noteSlice";
import _ from "lodash";

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
        className="menuItem rounded-md disabled:opacity-50 enabled:hover:bg-base-300 w-8 h-8 center"
        onClick={action}
        title={title}
        disabled={isDisabled}
      >
        <i className={`text-xl ri-${icon}`}></i>
      </button>
    </>
  );
};

export const FloatingMenuBar = () => {
  const { theme, setTheme } = useTheme();
  const editor = useContext(EditorContext);
  if (!editor) return null;

  const selectedNote = useReduxSelector(
    (state) => state.notes.selectedNote
  );

  const dispatch = useReduxDispatch();
  // list of none or more menu bar items
  const items: MenuBarItem[] = [
    {
      icon: "h-1",
      title: "Heading 1",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
      isDisabled: false,
    },
    {
      icon: "h-2",
      title: "Heading 2",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      isDisabled: false,
    },
    {
      icon: "h-3",
      title: "Heading 3",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
      isDisabled: false,
    },
    {
      icon: "text",
      title: "Paragraph",
      action: () =>
        editor
          .chain()
          .focus()
          .toggleNode("paragraph", "paragraph")
          .run(),
      isActive: () => editor.isActive("paragraph"),
      isDisabled: false,
    },
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
      icon: "underline",
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
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

  const groups = _.chunk(items, 4);

  return (
    <div className="border-2 border-base-300 flex items-center justify-between rounded-md p-1">
      {groups.map((group, index) => (
        <Fragment key={index}>
          <div className="flex items-center space-x-2">
            {group.map((item, index) => (
              <Fragment key={index}>
                <MenuItem {...item} />
              </Fragment>
            ))}
          </div>
          {index < groups.length - 1 && (
            <div className="w-px h-8 bg-base-300 mx-2"></div>
          )}
        </Fragment>
      ))}
    </div>
  );
};
