import MarkdownRenderer from "./MarkdownRenderer";
import { Comment } from "../../types/comment";

interface BlogCommentProps {
  comment: Comment;
}

function BlogComment({ comment }: BlogCommentProps) {

  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">
          &gt; {comment.author.name}
        </span>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="comment-body">
        <MarkdownRenderer content={comment.content} />
      </div>
    </div>
  );
}

export default BlogComment;