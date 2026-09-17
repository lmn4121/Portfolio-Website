"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { stabilizeStreamingMarkdown } from "@/lib/markdown";

const schema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https", "mailto"],
  },
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), ["target"], ["rel"]],
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
  },
};

const components: Components = {
  a({ href, children }) {
    if (!href) return <>{children}</>;
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};

type TwinMarkdownProps = {
  text: string;
};

export function TwinMarkdown({ text }: TwinMarkdownProps) {
  const source = stabilizeStreamingMarkdown(text);

  return (
    <div className="twin-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        skipHtml
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
