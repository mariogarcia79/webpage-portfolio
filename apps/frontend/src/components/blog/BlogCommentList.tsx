import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CommentAPI from "../../api/comments.api";
import BlogComment from "./BlogComment";
import { Comment } from "../../types/comment";

interface Props {
  postId: string;
}

function BlogCommentList({ postId }: Props) {
  const { isLoggedIn, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLoading(true);
    CommentAPI.getCommentsByPost(postId)
      .then((data) => setComments(data))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !token) return;

    setPosting(true);
    try {
      const newComment = await CommentAPI.createComment(postId, content.trim(), token);

      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (err) {
      alert("Failed to post comment");
    }
    setPosting(false);
  };

  return (
    <div className="page-content" style={{maxWidth: "900px", width: "100%"}}>
      <h2 className="title large left" style={{marginBottom: "1rem"}}># Comments</h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="page-body">
          <textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="textarea comment"
          />
          <button className="button" disabled={posting || !content.trim()}>
            {posting ? "Posting..." : "Add Comment"}
          </button>
        </form>
      ) : (
        <p className="post-summary">Log in to write a comment.</p>
      )}

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p style={{marginTop: "1rem"}} className="error">No comments yet</p>
      ) : (
        <div className="comments-list" style={{marginBottom: "5rem"}}>
          {comments.map((c) => (
            <div
              key={c._id}
              className="comment-wrapper"
            >
              <BlogComment comment={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogCommentList;
