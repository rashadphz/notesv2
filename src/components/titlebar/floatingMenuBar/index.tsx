import { Fragment, useContext } from "react";
import EditorContext from "@/EditorContext";
import { useTheme } from "@/theme/useTheme";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  createNoteAsync,
  deleteNoteAsync,
} from "@/redux/slices/noteSlice";
import _ from "lodash";
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  TypeIcon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
  MoonIcon,
} from "lucide-react";

interface MenuBarItem {
  icon: typeof Heading1Icon;
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
      <button
        className="menuItem rounded-md disabled:opacity-50 enabled:hover:bg-base-300 w-8 h-8 center"
        onClick={action}
        title={title}
        disabled={isDisabled}
      ></button>
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
      icon: Heading1Icon,
      title: "Heading 1",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
      isDisabled: false,
    },
    {
      icon: Heading2Icon,
      title: "Heading 2",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      isDisabled: false,
    },
    {
      icon: Heading3Icon,
      title: "Heading 3",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
      isDisabled: false,
    },
    {
      icon: TypeIcon,
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
      icon: BoldIcon,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      isDisabled: false,
    },
    {
      icon: ItalicIcon,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      isDisabled: false,
    },
    {
      icon: StrikethroughIcon,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      isDisabled: false,
    },
    {
      icon: UnderlineIcon,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
      isDisabled: false,
    },
    {
      icon: MoonIcon,
      title: "Dark Mode",
      action: () => {
        setTheme(theme === "light" ? "dark" : "light");
      },
      isActive: () => false,
      isDisabled: false,
    },
  ];

  const groupedItems = _.chunk(items, 4);

  return (
    <div className="border-2 border-base-300 flex rounded-md p-1 shadow-xl bg-base-100 divide-x divide-base-300 w-auto space-x-4">
      {groupedItems.map((group, index) => (
        <div key={index} className="space-x-1 flex">
          {group.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="p-2 hover:bg-base-300 active:bg-base-200 rounded-md"
            >
              <item.icon className={`w-5 h-5`} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
