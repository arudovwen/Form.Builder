import { useCallback, useEffect, useState } from "react";
import FileUpload from "../forms/file-uploader";

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

  const handleFileLoaded = useCallback(
    (data) => {
      setValue?.(element.id, data);
      setFileData(data);
    },
    [element.id, setValue],
  );

  const handleDeleteFile = () => {
    setValue?.(element.id, null);
    setFileData(null);
  };

  return (
    <div>
      {!isReadOnly && (
        <FileUpload
          onFileLoaded={handleFileLoaded}
          disabled={isReadOnly}
          multiple={element?.isMultiple}
          handleDeleteFile={handleDeleteFile}
          list={fileData}
          accept={element?.acceptedFiles}
        />
      )}
    </div>
  );
}
