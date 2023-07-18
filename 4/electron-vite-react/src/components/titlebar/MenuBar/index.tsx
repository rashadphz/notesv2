import { Fragment, useContext } from "react";
//@ts-ignore
import nightwind from "nightwind/helper";
import EditorContext from "@/EditorContext";
import { useTheme } from "@/theme/useTheme";

interface MenuBarItem {
  icon: string;
  title: string;
  action: () => void;
  isActive: () => boolean;
}

const MenuItem = ({ icon, title, action, isActive }: MenuBarItem) => {
  return (
    <>
      <style>{`
        .menuItem {
            -webkit-app-region: no-drag;
        }
      `}</style>
      <button
        className="menuItem p-2 rounded-md hover:bg-base-300 w-10 h-10"
        onClick={action}
        title={title}
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

  const items: MenuBarItem[] = [
    {
      icon: "bold",
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: "italic",
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: "strikethrough",
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: "moon-line",
      title: "Dark Mode",
      action: () => {
        setTheme(theme === "light" ? "dark" : "light");
      },
      isActive: () => false,
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
