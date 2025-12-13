import { Comment } from "../../types/comment";
import { useAuth } from "../../context/AuthContext";
import CommentAPI from "../../api/comments.api";

interface BlogCommentProps {
  postId: string;
  comment: Comment;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

function BlogComment({ postId, comment, setComments }: BlogCommentProps) {
  const { role } = useAuth();

  const handleDeleteComment = async (commentId: string) => {
    try {
      await CommentAPI.deleteComment(postId, commentId);

      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== commentId)
      );
    } catch (error) {
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        {comment.author ? (
          <span className="comment-author">
            {comment.author.name}
          </span>
        ) : (
          <span style={{ color: "var(--color-text-1)" }} className="comment-author">
            deleted user
          </span>
        )}
        <span className="comment-date" style={{ marginLeft: "auto" }}>
          {new Date(comment.createdAt).toLocaleString()}
        </span>

        {role === "admin" ? (
          <button
            className="button compact delete"
            style={{
              marginLeft: "1rem",
              height: "1.5rem",
              textAlign: "center",
              padding: "0 0.5rem",
            }}
            onClick={() => handleDeleteComment(comment._id)}
          >
            Delete
          </button>
        ) : null}
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