import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { updatePost, deletePost, show } from "../../services/postService";
import { UserContext } from "../../contexts/UserContext";
import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from "../../services/commentService";
import "./PostShow.css";

const PostShow = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, commentsData] = await Promise.all([
          show(postId),
          getCommentsByPost(postId),
        ]);
        setPost(postsData);
        setComments(commentsData);
        setEditContent(postsData.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async (evt) => {
    try {
      await deletePost(postId);
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (evt) => {
    evt.preventDefault();
    try {
      const updated = await updatePost(postId, editContent);
      setPost(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (evt) => {
    evt.preventDefault();
    try {
      const newComment = await createComment(postId, content);
      setComments([...comments, newComment]);
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="post-show__loading">Loading...</p>;
  if (!post) return <p className="post-show__loading">Post not found</p>;

  return (
    <main className="post-show">
      <div className="post-show__hero">
        <p className="post-show__eyebrow">Post</p>
        <p className="post-show__movie-link">
          About:{" "}
          <span
            onClick={() => navigate(`/movies/${post.movie._id}`)}
            className="post-show__movie-title"
          >
            {post.movie?.title || "a film"}
          </span>
        </p>

        {isEditing ? (
          <form className="post-show__edit-form" onSubmit={handleEdit}>
            <textarea
              className="post-show__edit-textarea"
              value={editContent}
              onChange={(evt) => setEditContent(evt.target.value)}
              required
            />
            <div className="post-show__edit-actions">
              <button
                className="post-show__btn post-show__btn--save"
                type="submit"
              >
                Save
              </button>
              <button
                className="post-show__btn post-show__btn--cancel"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="post-show__content">{post.content}</p>
            <div className="post-show__meta">
              <span className="post-show__author">{post.author?.username}</span>
              <span className="post-show__date">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {user && user._id === post.author?._id?.toString() && (
              <div className="post-show__actions">
                <button
                  className="post-show__btn post-show__btn--edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="post-show__btn post-show__btn--delete"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-show__body">
        <div className="post-show__comments-header">
          <h2 className="post-show__section-title">Comments</h2>
          <span className="post-show__comment-count">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>
        <hr className="post-show__rule" />

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <div className="comment-card__header">
                <span className="comment-card__author">
                  {comment.author?.username}
                </span>
                <div className="comment-card__actions">
                  <span className="comment-card__date">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {user && user._id === comment.author?._id && (
                    <button
                      className="comment-card__delete"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <p className="comment-card__content">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="post-show__empty">No comments yet.</p>
        )}

        {user ? (
          <form className="post-show__form" onSubmit={handleAddComment}>
            <h2 className="post-show__section-title">Add a Comment</h2>
            <hr className="post-show__rule" />
            <textarea
              className="post-show__textarea"
              value={content}
              onChange={(evt) => setContent(evt.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button className="post-show__submit" type="submit">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="post-show__signin-prompt">
            <span onClick={() => navigate("/sign-in")}>Sign in</span> to write a
            comment.
          </p>
        )}
      </div>
    </main>
  );
};

export default PostShow;
