import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import { fetchMoviesByQuery } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1); // Стан для номера сторінки
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    // Додаю page у queryKey для коректного кешування кожної сторінки
    queryKey: ["movies", query, page],
    queryFn: () => fetchMoviesByQuery(query, page),
    enabled: query.length > 0,
    // Використовую keepPreviousData, щоб уникнути миготіння (placeholderData)
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return;
    setQuery(newQuery);
    setPage(1); // Скидаю на першу сторінку при новому пошуку
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (query && data && data.results.length === 0 && !isLoading) {
      toast.error("No movies found for your request.");
    }
  }, [data, query, isLoading]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      <main className={css.container}>
        {isError && <ErrorMessage />}

        {/* Показую Loader при першому завантаженні або зміні сторінок */}
        {(isLoading || isFetching) && <Loader />}

        {data && data.results.length > 0 && (
          <>
            <MovieGrid movies={data.results} onSelect={setSelectedMovie} />

            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={data.total_pages > 500 ? 500 : data.total_pages} // TMDB обмежує пагінацію 500 сторінками
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              forcePage={page - 1}
              containerClassName={css.pagination}
              pageClassName={css.pageItem}
              activeClassName={css.activePage}
              previousClassName={css.prevItem}
              nextClassName={css.nextItem}
            />
          </>
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
