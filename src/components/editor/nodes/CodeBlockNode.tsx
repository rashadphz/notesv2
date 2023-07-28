import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import "highlight.js/styles/github-dark-dimmed.css";
// import "highlight.js/styles/github.css";
// import "highlight.js/styles/grayscale.css";
import CleaanBadge from "@/components/CleaanBadge";

const CodeBlock = ({ children }: any) => {
  return (
    <pre
      className="p-5 font-mono font-medium rounded-lg border-[2px] border-base-300 bg-base-200 opacity-80"
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
    <CleaanBadge className="text-md mx-[1px] top-[1px] bg-content-focus absolute cursor-pointer ">
      <select className="outline-none appearance-none bg-transparent border-none p-0 m-0 w-fit font-inherit font-inherit cursor-inherit line-inherit cursor-pointer min-w-0">
        {languages.map((lang, index) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </CleaanBadge>
  );
  return (
    <select
      defaultValue={defaultLanguage}
      onChange={onChange}
      className="text-s p-2 absolute right-[0.5rem] top-[0.1rem]
      rounded-b-2xl focus:outline-none"
    >
      {/* <option disabled>—</option>
      {languages.map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))} */}
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
