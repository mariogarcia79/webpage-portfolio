import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const defaultImgAttrs =
  Array.isArray(defaultSchema.attributes?.img)
    ? defaultSchema.attributes!.img
    : [];

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...defaultImgAttrs, "src", "alt"],
  },
  // Only allow safe src protocols for images
  protocols: {
    ...((defaultSchema as any).protocols || {}),
    src: ["http", "https", "data"],
  },
};

interface MarkdownProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownProps) {
  return (
    <div className="prose">
      {/* run syntax highlighting first, then sanitize output to ensure no unsafe content remains */}
      <ReactMarkdown rehypePlugins={[rehypePrism, [rehypeSanitize, schema]]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}