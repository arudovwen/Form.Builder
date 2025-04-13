import { useEffect } from "react";
import Layout, { BuilderProps } from "../../components/editor/layout";
import { setItem } from "../../utils/localStorageControl";

const HomePage = ({
  onSubmit,
  questionData,
  isReadOnly,
  config = {
    buttonColor: "#333",
  },
}: BuilderProps) => {
  useEffect(() => {
    if (config) {
      setItem("config", config);
    }
  }, [config]);
  return (
    <Layout
      onSubmit={onSubmit}
      questionData={questionData}
      isReadOnly={isReadOnly}
    />
  );
};

export default HomePage;
