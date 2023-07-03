import { Editor, Range, Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { ReactNode, useEffect, useState } from "react";
import tippy from "tippy.js";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Image as ImageIcon,
  Code,
  CheckSquare,
} from "lucide-react";

const Command = Extension.create({
  name: "slash",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Text",
      description: "Just some plain text.",
      icon: <Text size={18} />,
    },
    {
      title: "Heading 1",
      description: "Big heading.",
      icon: <Heading1 size={18} />,
    },
    {
      title: "Heading 2",
      description: "Medium heading.",
      icon: <Heading2 size={18} />,
    },
    {
      title: "Heading 3",
      description: "Small heading.",
      icon: <Heading3 size={18} />,
    },
  ];
};

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface CommandListProps {
  items: CommandItemProps[];
  command: any;
  editor: Editor;
  range: Range;
}

const CommandList = ({
  items,
  command,
  editor,
  range,
}: CommandListProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const relevantKeys = ["ArrowDown", "ArrowUp", "Enter"];
      if (!relevantKeys.includes(event.key)) return;

      event.preventDefault();
      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % items.length);
      }
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (prev) => (prev - 1 + items.length) % items.length
        );
      }
      if (event.key === "Enter") {
        command({ editor, range, props: items[selectedIndex] });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  return (
    <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all">
      {items.map((item, index) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 px-2 py-1 rounded-md hover:bg-stone-100 text-left transition-all ${
              index == selectedIndex ? "bg-gray-100" : ""
            }`}
            key={index}
          >
            <div className="flex w-8 h-8 items-center justify-center rounded-sm border border-stone-200">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default SlashCommand;
