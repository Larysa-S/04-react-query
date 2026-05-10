import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";

import MovieService from "../../services/movieService";
import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";

import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // useInfiniteQuery для пагінації
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["movies", query],
    queryFn: ({ pageParam = 1 }) =>
      MovieService.fetchMoviesByQuery(query, pageParam as number),
    getNextPageParam: (lastPage) => {
      // Якщо поточна сторінка менша за загальну, повертається наступний номер
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    enabled: query.length > 0,
    initialPageParam: 1,
  });

  // Об'єдную результати всіх завантажених сторінок в один масив
  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return;
    setQuery(newQuery);
  };

  // Виводжу повідомлення, якщо за запитом нічого не знайдено
  useEffect(() => {
    if (query && data && movies.length === 0 && !isLoading) {
      toast.error("No movies found for your request.");
    }
  }, [data, query, movies.length, isLoading]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      <main className={css.container}>
        {isError && <ErrorMessage />}

        {movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        )}

        {/* Стан завантаження (первинне або підвантаження сторінок) */}
        {(isLoading || isFetchingNextPage) && <Loader />}

        {/* Кнопка Load More з'являється лише якщо є що завантажувати далі */}
        {hasNextPage && !isFetchingNextPage && !isLoading && (
          <LoadMoreBtn onClick={() => fetchNextPage()} />
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
