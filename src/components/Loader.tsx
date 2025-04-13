import { useEffect } from "react";
import { getItem } from "../utils/localStorageControl";

// Loader.tsx
const Loader = () => {
  useEffect(() => {
    const config = getItem("config");
    const savedColor = config?.loaderColor || "#333";
    document.documentElement.style.setProperty("--loader-color", savedColor);
  }, []);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
