import { PulseLoader } from "react-spinners";
import css from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={css.loaderWrapper}>
      <PulseLoader
        color="#5710db"
        size={15}
        margin={2}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {}
      <p className={css.text}>Loading movies, please wait...</p>
    </div>
  );
};

export default Loader;
