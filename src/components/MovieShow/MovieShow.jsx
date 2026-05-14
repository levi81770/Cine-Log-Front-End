import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { show } from "../../services/movieService";
import { UserContext } from "../../contexts/UserContext";
import { getPostsByMovie, createPost } from "../../services/postService";
import "./MovieShow.css";

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

  if (loading) return <p className="movie-show__loading">Loading...</p>;
  if (!movie) return <p className="movie-show__loading">Movie not found</p>;

  return (
    <main className="movie-show">
      <div className="movie-show__hero">
        <div className="movie-show__poster">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} />
          ) : (
            <span className="movie-show__poster-placeholder">🎬</span>
          )}
        </div>
        <div className="movie-show__hero-info">
          <p className="movie-show__eyebrow">Now Viewing</p>
          <h1 className="movie-show__title">{movie.title}</h1>
          <p className="movie-show__meta">
            {movie.year}
            {movie.runtime && ` · ${movie.runtime} min`}
          </p>
          <div className="movie-show__genres">
            {movie.genres?.map((genre) => (
              <span
                key={genre}
                className="movie-show__genre"
                onClick={() => navigate(`/movies?genre=${genre}`)}
              >
                {genre}
              </span>
            ))}
          </div>
          <p className="movie-show__plot">{movie.plot}</p>
        </div>
      </div>

      <div className="movie-show__body">
        <div className="movie-show__posts-header">
          <h2 className="movie-show__section-title">Posts</h2>
          <span className="movie-show__post-count">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
        <hr className="movie-show__rule" />

        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="post-card"
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              <div className="post-card__header">
                <span className="post-card__author">
                  {post.author.username}
                </span>
                <span className="post-card__date">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="post-card__content">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="movie-show__empty">No posts yet. Be the first!</p>
        )}

        {user ? (
          <form className="movie-show__form" onSubmit={handleSubmit}>
            <h2 className="movie-show__section-title">Write a Post</h2>
            <hr className="movie-show__rule" />
            <textarea
              className="movie-show__textarea"
              value={content}
              onChange={(evt) => setContent(evt.target.value)}
              placeholder={`Share your thoughts about ${movie.title}...`}
              required
            />
            <button className="movie-show__submit" type="submit">
              Publish Post
            </button>
          </form>
        ) : (
          <p className="movie-show__signin-prompt">
            <span onClick={() => navigate("/sign-in")}>Sign in</span> to write a
            post.
          </p>
        )}
      </div>
    </main>
  );
};

export default MovieShow;
