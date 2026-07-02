import { useEffect } from "react";
import Layout, { BuilderProps } from "../../components/editor/layout";
import { setItem } from "../../utils/localStorageControl";

const HomePage = ({
  onSubmit,
  onChange,
  onLogAction,
  questionData,
  isReadOnly,
  config = {
    buttonColor: "#333",
  },
  title,
  loading,
  goBackUrl,
  onPublish,
  previewLoading,
  saveLoading,
  publishLoading,
  onTitleChange,
  uploadUrl,
  onAddTemplate,
  templates,
  onShowVersion,
}: BuilderProps) => {
  useEffect(() => {
    if (config) {
      setItem("config", config);
    }
  }, [config]);
  return (
    <Layout
      onSubmit={onSubmit}
      onChange={onChange}
      onLogAction={onLogAction}
      onPublish={onPublish}
      questionData={questionData}
      isReadOnly={isReadOnly}
      title={title}
      goBackUrl={goBackUrl}
      loading={loading}
      previewLoading={previewLoading}
      saveLoading={saveLoading}
      publishLoading={publishLoading}
      onTitleChange={onTitleChange}
      uploadUrl={uploadUrl}
      onAddTemplate={onAddTemplate}
      templates={templates}
      onShowVersion={onShowVersion}
    />
  );
};

export default HomePage;
