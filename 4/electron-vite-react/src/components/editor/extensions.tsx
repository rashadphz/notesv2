import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import { ListItem } from "@tiptap/extension-list-item";
import { Heading } from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Text } from "@tiptap/extension-text";
import { Paragraph } from "@tiptap/extension-paragraph";
import { History } from "@tiptap/extension-history";
import { HardBreak } from "@tiptap/extension-hard-break";

import { lowlight } from "lowlight/lib/core.js";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import rust from "highlight.js/lib/languages/rust";

import {
  Extension,
  ReactNodeViewRenderer,
  textblockTypeInputRule,
} from "@tiptap/react";
import CodeBlockNode from "./nodes/CodeBlockNode";
import SlashCommand from "./extensions/slash";
import { TagExtension } from "./extensions/tag";
import suggestion from "./extensions/tag/suggestion";

lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);
lowlight.registerLanguage("python", python);
lowlight.registerLanguage("java", java);
lowlight.registerLanguage("cpp", cpp);
lowlight.registerLanguage("rust", rust);

const HeaderDoc = Document.extend({
  content: "heading block*",
});

const BetterHeading = Heading.extend({
  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level}})[ \t]$`), // only match on space, not enter
        type: this.type,
        getAttributes: {
          level,
        },
      });
    });
  },
});

export const TipTapExtensions = [
  HeaderDoc,
  Text,
  BetterHeading,
  Paragraph,
  HardBreak,
  //   StarterKit.configure({
  //     document: false,
  //     bulletList: {
  //       HTMLAttributes: {
  //         class: "list-disc list-outside leading-3 -mt-2",
  //       },
  //     },
  //     orderedList: {
  //       HTMLAttributes: {
  //         class: "list-decimal list-outside leading-3 -mt-2",
  //       },
  //     },
  //     listItem: {
  //       HTMLAttributes: {
  //         class: "leading-normal -mb-2",
  //       },
  //     },
  //     blockquote: {
  //       HTMLAttributes: {
  //         class: "border-l-4 border-base-content",
  //       },
  //     },
  //   }),
  History,
  TagExtension.configure({
    HTMLAttributes: {
      class: "text-primary-content",
    },
    suggestion,
  }),
  TextStyle,
  Typography,
  SlashCommand,
  Color,
  Link.configure({
    HTMLAttributes: {
      class:
        "underline cursor-pointer text-primary-neutral-content transition-colors",
    },
  }),
  Placeholder.configure({
    emptyNodeClass: "text-base-content opacity-30 is-empty",
    placeholder: ({ node }) => {
      if (node.type.name === "heading" && node.attrs.level === 1) {
        return "Untitled";
      }

      return "Press / for commands or start typing...";
    },
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockNode);
    },
    addKeyboardShortcuts() {
      return {
        Tab: () => this.editor.commands.insertContent("\t"),
      };
    },
  }).configure({
    lowlight,
  }),
  Markdown.configure({
    html: true,
    transformPastedText: true,
    transformCopiedText: true,
    breaks: true,
    linkify: true,
  }),
];
