import { useEffect } from "react";
import { getItem } from "../utils/localStorageControl";
import clsx from "clsx";

// Loader.tsx
const Loader = ({ loadingClass }: any) => {
  const mergedClass = clsx(
    "h-full w-full min-h-[300px] flex justify-center items-center",
    loadingClass
  );
  useEffect(() => {
    const config = getItem("config");
    const savedColor = config?.loaderColor || "#333";
    document.documentElement.style.setProperty("--loader-color", savedColor);
  }, []);
  return (
    <div className={mergedClass}>
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
