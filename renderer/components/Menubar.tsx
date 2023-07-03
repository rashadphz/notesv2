import { Fragment, useContext } from "react";
import { MenuItem } from "./MenuItem";
import EditorContext from "../EditorContext";
import nightwind from "nightwind/helper";
import { useTheme } from "next-themes";

interface MenuBarItem {
  icon: string;
  title: string;
  action: () => void;
  isActive: () => boolean;
}

export const MenuBar = () => {
  const editor = useContext(EditorContext);
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    nightwind.beforeTransition();
    if (theme !== "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

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
      action: toggle,
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
