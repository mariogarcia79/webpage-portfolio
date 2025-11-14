import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";

interface MarkdownProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownProps) {
  return (
    <div className="prose">
      <ReactMarkdown rehypePlugins={[rehypePrism]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}