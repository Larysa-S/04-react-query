import { useEffect } from "react";
import { createPortal } from "react-dom"; // Додано для порталу
import type { Movie } from "../../types/movie";
import { getMovieImageUrl } from "../../services/movieService";
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

// Отримуємо елемент порталу з index.html
const modalRoot = document.querySelector("#modal-root") as HTMLElement;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    // 1. Закриття по клавіші Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // 2. Блокуємо скрол тіла сторінки
    document.body.style.overflow = "hidden";

    // 3. Очищення (Cleanup): видаляємо слухача та повертаємо скрол
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Функція для закриття по кліку на бекдроп
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Використовуємо createPortal для рендеру в #modal-root
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <img
          className={css.image}
          src={getMovieImageUrl(movie.backdrop_path, "original")}
          alt={movie.title}
        />

        <div className={css.content}>
          <h2 className={css.title}>{movie.title}</h2>

          <div className={css.meta}>
            <p>
              <strong>Rating:</strong> {movie.vote_average.toFixed(1)} / 10
            </p>
            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
          </div>

          <p className={css.overview}>{movie.overview}</p>
        </div>
      </div>
    </div>,
    modalRoot, // Другий аргумент createPortal
  );
}
