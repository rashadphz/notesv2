import { Fragment, useContext } from "react";
import { MenuItem } from "./MenuItem";
import EditorContext from "../EditorContext";

interface MenuBarItem {
  icon: string;
  title: string;
  action: () => void;
  isActive: () => boolean;
}

export const MenuBar = () => {
  const editor = useContext(EditorContext);

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
