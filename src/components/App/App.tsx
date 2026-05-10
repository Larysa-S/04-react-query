import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import MovieService from "../../services/movieService";

import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setLoading(true);
      setError(false);

      const data = await MovieService.fetchMoviesByQuery(query);

      // Перевірка на успішність запиту та наявність результатів
      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
      } else {
        setMovies(data.results);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      <Toaster position="top-right" reverseOrder={false} />

      <main className={css.container}>
        {error && <ErrorMessage />}
        {loading && <Loader />}

        {/* Галерея рендериться лише якщо є фільми і немає помилки */}
        {movies.length > 0 && !error && !loading && (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
