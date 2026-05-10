import type { Movie } from "../../types/movie";
import { getMovieImageUrl } from "../../services/movieService";
import css from "./MovieGrid.module.css";

// Інтерфейс пропсів
interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  // Рендеримо тільки якщо є фільми
  if (movies.length === 0) return null;

  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id} onClick={() => onSelect(movie)}>
          {}
          <div className={css.card}>
            <img
              className={css.image}
              src={getMovieImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
