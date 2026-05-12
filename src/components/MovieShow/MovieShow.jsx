import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { show } from "../../services/movieService";
import { UserContext } from "../../contexts/UserContext";
import { getPostsByMovie, createPost } from "../../services/postService";

const MovieShow = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { user } = useContext(UserContext);

  const [movie, setMovie] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, postsData] = await Promise.all([
          show(movieId),
          getPostsByMovie(movieId),
        ]);
        setMovie(movieData);
        setPosts(postsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newPost = await createPost(movieId, content);
      setPosts([newPost, ...posts]);
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found</p>;

  return (
    <main>
      <h1>{movie.title}</h1>
      <p>
        {movie.year} · {movie.genres?.join(", ")}
      </p>
      <p>{movie.plot}</p>

      <h2>Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} onClick={() => navigate(`/posts/${post._id}`)}>
            <p>{post.author.username}</p>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts yet.</p>
      )}

      {user ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(evt) => setContent(evt.target.value)}
            placeholder="Write a post..."
            required
          />
          <button type="submit">Post</button>
        </form>
      ) : (
        <p>
          <span onClick={() => navigate('/sign-in')}>Sign in</span> to write a post.
        </p>
      )}
    </main>
  );
};

export default MovieShow;
