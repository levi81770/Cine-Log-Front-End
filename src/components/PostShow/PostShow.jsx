import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { updatePost, deletePost, show } from "../../services/postService";
import { UserContext } from "../../contexts/UserContext";
import { getCommentsByPost, createComment, deleteComment } from "../../services/commentService";

const PostShow = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [editContent, setEditContent] = useState('');
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
      await deletePost(postId)
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

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
      setContent('');
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId)
      setComments(comments.filter((c) => c._id !== commentId))
    } catch (err) {
      console.error(err);
    }
  }


  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <main>

      {isEditing ? (
        <form onSubmit={handleEdit}>
          <textarea value={editContent} onChange={(evt) => setEditContent(evt.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>{post.author?.username}</p>
          <p>{post.content}</p>

          {user && user._id === post.author?._id && (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}

      <h2>Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id}>
            <p>{comment.author?.username}</p>
            <p>{comment.content}</p>
            {user && user._id === comment.author?._id && (
              <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      {user ? (
        <form onSubmit={handleAddComment}>
          <textarea
            value={content}
            onChange={(evt) => setContent(evt.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit">Post</button>
        </form>
      ) : (
        <p>
          <span onClick={() => navigate('/sign-in')}>Sign in</span> to write a comment.
        </p>
      )}
    </main>
  );
};

export default PostShow;
