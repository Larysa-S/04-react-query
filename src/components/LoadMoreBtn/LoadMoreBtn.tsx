import css from "./LoadMoreBtn.module.css";

interface LoadMoreBtnProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export default function LoadMoreBtn({
  onClick,
  children = "Load more",
}: LoadMoreBtnProps) {
  return (
    <div className={css.container}>
      <button className={css.button} type="button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
