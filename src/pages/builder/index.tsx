import { useEffect } from "react";
import Layout, { BuilderProps } from "../../components/editor/layout";
import { setItem } from "../../utils/localStorageControl";

const HomePage = (props: BuilderProps) => {
  const { config = { buttonColor: "#4f46e5" } } = props;

  useEffect(() => {
    if (config) {
      setItem("config", config);
    }
  }, [config]);

  return <Layout {...props} config={config} />;
};

export default HomePage;
