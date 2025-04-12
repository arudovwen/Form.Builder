import Layout, { BuilderProps } from "../../components/editor/layout";

const HomePage = ({ onSubmit, questionData, isReadOnly }: BuilderProps) => {
  return (
    <Layout
      onSubmit={onSubmit}
      questionData={questionData}
      isReadOnly={isReadOnly}
    />
  );
};

export default HomePage;
