import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { index, getGenres } from '../../services/movieService';

const MoviesIndex = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
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
    <main>
      <h1>Browse Classic Films</h1>

      <select value={selectedGenre} onChange={handleGenreChange}>
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div>
          {movies.map((movie) => (
            <div key={movie._id} onClick={() => navigate(`/movies/${movie._id}`)}>
              <h2>{movie.title}</h2>
              <p>{movie.year} · {movie.genres?.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        {currentPage > 2 && <button onClick={() => setCurrentPage(1)}>1</button>}
        {currentPage > 3 && <span>...</span>}

        {currentPage > 1 && <button onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</button>}
        <button disabled>{currentPage}</button>
        {currentPage < totalPages && <button onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</button>}
        
        {currentPage < totalPages - 2 && <span>...</span>}
        {currentPage < totalPages - 1 && <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </main>
  );
}

export default MoviesIndex