import { Editor, ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import tippy from "tippy.js";
import TagList from "./tagList";
import { Tag } from "knex/types/tables";

const suggestion: Omit<SuggestionOptions<Tag>, "editor"> = {
  items: (props: { query: string }) => {
    return [
      {
        id: "1",
        name: "vision",
      },
      {
        id: "2",
        name: "ai",
      },
    ];
  },

  render: () => {
    let component: ReactRenderer | null = null;
    let popup: any = null;

    return {
      onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
        component = new ReactRenderer(TagList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

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

      onUpdate(props) {
        if (!component) {
          return;
        }
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (!component) return;

        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        // @ts-ignore
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        if (!component) return;
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default suggestion;
