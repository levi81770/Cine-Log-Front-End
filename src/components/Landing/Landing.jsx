// src/components/Landing/Landing.jsx
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { index } from "../../services/movieService";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await index(1, "");
        setMovies(data.movies.slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <main className="landing">
      {/* Hero */}
      <div className="landing__hero">
        <div className="landing__hero-content">
          <p className="landing__eyebrow">Classic Cinema · 1905–2015</p>
          <h1 className="landing__title">
            Every film has
            <br />a story to tell.
          </h1>
          <p className="landing__subtitle">
            Discover, review, and discuss 21,000 classic films with fellow
            cinephiles.
          </p>
          <div className="landing__actions">
            <button
              className="landing__btn landing__btn--primary"
              onClick={() => navigate("/sign-up")}
            >
              Join CineLog
            </button>
            <button
              className="landing__btn landing__btn--secondary"
              onClick={() => navigate("/movies")}
            >
              Browse Films
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="landing__stats">
          <div className="landing__stat">
            <span className="landing__stat-num">21,000</span>
            <span className="landing__stat-label">Classic Films</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat">
            <span className="landing__stat-num">1905</span>
            <span className="landing__stat-label">Earliest Film</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat">
            <span className="landing__stat-num">2015</span>
            <span className="landing__stat-label">Latest Film</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="landing__preview">
        <div className="landing__preview-header">
          <h2 className="landing__preview-title">Now Showing</h2>
          <span
            className="landing__preview-link"
            onClick={() => navigate("/movies")}
          >
            Browse all films →
          </span>
        </div>
        <hr className="landing__rule" />

        <div className="landing__grid">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="landing__card"
              onClick={() => navigate(`/movies/${movie._id}`)}
            >
              <div className="landing__card-poster">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} />
                ) : (
                  <span className="landing__card-placeholder">🎬</span>
                )}
              </div>
              <div className="landing__card-info">
                <div className="landing__card-year">{movie.year}</div>
                <div className="landing__card-title">{movie.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Landing;
