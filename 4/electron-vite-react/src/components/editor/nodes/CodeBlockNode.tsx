import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import "highlight.js/styles/github-dark-dimmed.css";

const CodeBlock = ({ children }) => {
  return (
    <pre
      className="p-5 font-mono font-medium text-stone-800 rounded-lg bg-neutral-100 border-gray-600 border-[1px]"
      spellCheck="false"
    >
      {children}
    </pre>
  );
};

interface LanguageSelectorProps {
  languages: string[];
  defaultLanguage: string;
  onChange: (language: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LanguageSelector = ({
  languages,
  defaultLanguage,
  onChange,
}: LanguageSelectorProps) => {
  return (
    <select
      defaultValue={defaultLanguage}
      onChange={onChange}
      className="text-s p-2 absolute right-[0.5rem] top-[0.1rem]
      rounded-b-2xl focus:outline-none"
    >
      <option disabled>—</option>
      {languages.map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
};

const CodeBlockNode = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => {
  return (
    <NodeViewWrapper className="code-block relative">
      <LanguageSelector
        languages={extension.options.lowlight.listLanguages()}
        defaultLanguage={defaultLanguage}
        onChange={(event) =>
          updateAttributes({ language: event.target.value })
        }
      />
      <CodeBlock>
        <NodeViewContent className="content" />
      </CodeBlock>
    </NodeViewWrapper>
  );
};

export default CodeBlockNode;
