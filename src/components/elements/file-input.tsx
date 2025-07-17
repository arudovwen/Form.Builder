import { useEffect, useState } from "react";
import FileUpload from "../forms/file-uploader";
import UniversalFileViewer from "../UniversalFileViewer";

export default function FileInput({ element, validationData }) {
  const [fileData, setFileData] = useState(element?.value ?? null);
  const {
    register = () => ({}),
    setValue,
    isReadOnly,
    watch,
  } = validationData || {};

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  useEffect(() => {
    if (watch) {
      const subscription = watch((values) => {
        setFileData(values[element.id]);
      });
      return () => subscription.unsubscribe?.(); // clean up if watch returns a subscription (e.g., react-hook-form)
    }
  }, [watch, element.id]);

  const handleFileLoaded = (data) => {
    setValue?.(element.id, data);
    setFileData(data);
  };

  return (
    <div>
      <FileUpload onFileLoaded={handleFileLoaded} disabled={isReadOnly} />
      {fileData && (
        <UniversalFileViewer fileUrl={fileData.base64} fileName={fileData.name} />
      )}
    </div>
  );
}
