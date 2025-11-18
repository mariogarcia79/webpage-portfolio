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
        <p style={{ whiteSpace: "pre-wrap" }}>
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export default BlogComment;