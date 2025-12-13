import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";


interface MarkdownProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownProps) {
  return (
    <div className="prose">
        <ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, defaultSchema], rehypePrism]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}