import toast, { Toaster } from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleFormAction = (formData: FormData) => {
    const query = formData.get("query") as string;

    if (!query || query.trim() === "") {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(query.trim());
  };

  return (
    <header className={css.header}>
      <Toaster position="top-right" />
      <div className={css.container}>
        <span className={css.link}>Powered by TMDB</span>

        <form className={css.form} action={handleFormAction}>
          <input
            className={css.input}
            name="query"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search movies..."
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
