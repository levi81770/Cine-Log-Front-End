import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router";
import { index, getGenres } from '../../services/movieService';
import './MoviesIndex.css'



const MoviesIndex = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || "",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres()
        setGenres(data)
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const data = await index(currentPage, selectedGenre)
        setMovies(data.movies)
        setTotalPages(data.totalPages)
        
      } catch (err) {
        console.error(err);
        
      } finally {
        setLoading(false)
      }
    }
    fetchMovies();
  }, [currentPage, selectedGenre]);

  const handleGenreChange = (evt) => {
    setSelectedGenre(evt.target.value);
    setCurrentPage(1); // Reset to first page when genre changes
  }


  return (
    <main className="movies-index">
      <div className="movies-index__header">
        <div>
          <h1 className="movies-index__title">
            {selectedGenre ? selectedGenre : 'All Films'}
          </h1>
          <p className="movies-index__sub">21,000 films · 1905–2015</p>
        </div>
        <select
          className="movies-index__select"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <hr className="movies-index__rule" />

      {loading ? (
        <p className="movies-index__loading">Loading movies...</p>
      ) : (
        <div className="movies-index__grid">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() => navigate(`/movies/${movie._id}`)}
            >
              <div className="movie-card__poster">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className="movie-card__poster-placeholder"
                  style={{ display: movie.poster ? "none" : "flex" }}
                >
                  🎬<span>{movie.title}</span>
                </span>
              </div>
              <div className="movie-card__info">
                <div className="movie-card__year">{movie.year}</div>
                <div className="movie-card__title">{movie.title}</div>
                <div className="movie-card__genres">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre}
                      className="movie-card__genre"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGenre(genre);
                        setCurrentPage(1);
                      }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="pagination__btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Back
        </button>
        {currentPage > 2 && (
          <button className="pagination__btn" onClick={() => setCurrentPage(1)}>
            1
          </button>
        )}
        {currentPage > 3 && <span className="pagination__dots">...</span>}

        {currentPage > 1 && (
          <button
            className="pagination__btn"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}
        <button className="pagination__btn  pagination__btn--current" disabled>
          {currentPage}
        </button>
        {currentPage < totalPages && (
          <button
            className="pagination__btn"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}

        {currentPage < totalPages - 2 && (
          <span className="pagination__dots">...</span>
        )}
        {currentPage < totalPages - 1 && (
          <button
            className="pagination__btn"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        )}
        <button
          className="pagination__btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default MoviesIndex