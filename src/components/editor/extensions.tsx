import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import Link from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { Paragraph } from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import { Text } from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "tiptap-markdown";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { Italic } from "@tiptap/extension-italic";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Strike } from "@tiptap/extension-strike";

import { lowlight } from "lowlight/lib/core.js";

import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import ts from "highlight.js/lib/languages/typescript";

import {
  ReactNodeViewRenderer,
  textblockTypeInputRule,
} from "@tiptap/react";
import SlashCommand from "./extensions/slash";
import { TagExtension } from "./extensions/tag";
import suggestion from "./extensions/tag/suggestion";
import CodeBlockNode from "./nodes/CodeBlockNode";
import Underline from "@tiptap/extension-underline";

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
  Bold,
  Code,
  Italic,
  Strike,
  Underline,
  Blockquote.configure({
    HTMLAttributes: {
      class: "border-l-4 border-base-content",
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc list-outside leading-3 -mt-2",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal list-outside leading-3 -mt-2",
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: "leading-normal -mb-2",
    },
  }),
  History,
  TagExtension.configure({
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
