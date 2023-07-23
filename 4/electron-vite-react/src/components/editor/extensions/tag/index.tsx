import CleaanBadge from "@/components/CleaanBadge";
import { mergeAttributes, Node } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { PluginKey } from "@tiptap/pm/state";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  textblockTypeInputRule,
} from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { Tag } from "knex/types/tables";

export type TagOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    options: TagOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions<Tag>, "editor">;
};

export const TagPluginKey = new PluginKey("tag");

export const TagNode = ({ node }: any) => {
  return (
    <NodeViewWrapper as="span" className="whitespace-nowrap">
      <CleaanBadge className="hover:cursor-pointer text-xs text-secondary-content bg-primary">
        {node.attrs.label ?? node.attrs.id}
      </CleaanBadge>
    </NodeViewWrapper>
  );
};

export const TagExtension = Node.create<TagOptions>({
  name: "tag",

  addNodeView() {
    return ReactNodeViewRenderer(TagNode);
  },

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${
          node.attrs.label ?? node.attrs.id
        }`;
      },
      suggestion: {
        char: "#",
        pluginKey: TagPluginKey,
        command: ({ editor, range, props }) => {
          console.log(range);
          const tag = props;
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          const overrideSpace = nodeAfter?.text?.startsWith(" ");

          if (overrideSpace) {
            range.to += 1;
          }

          console.log(props);
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: {
                  id: tag.id,
                  label: tag.name,
                },
              },
              {
                type: "text",
                text: " ",
              },
            ])
            .run();

          window.getSelection()?.collapseToEnd();
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow =
            !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
      },
    };
  },

  group: "inline",

  inline: true,

  selectable: true,

  atom: true,

  addAttributes() {
    console.log("addAttributes");
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            "data-id": attributes.id,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-label"),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            "data-label": attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true;
              tr.insertText(
                this.options.suggestion.char || "",
                pos,
                pos + node.nodeSize
              );

              return false;
            }
          });

          return isMention;
        }),
    };
  },
  //   addInputRules() {
  //     return [
  //       textblockTypeInputRule({
  //         find: new RegExp(`^(#\w*)$`),
  //         type: this.type,
  //         getAttributes: (match) => {
  //           const [_, id] = match;
  //           return { id };
  //         },
  //       }),
  //     ];
  //   },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
