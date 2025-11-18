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
};

interface MarkdownProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownProps) {
  return (
    <div className="prose">
      <ReactMarkdown rehypePlugins={[[rehypeSanitize, schema], rehypePrism]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}