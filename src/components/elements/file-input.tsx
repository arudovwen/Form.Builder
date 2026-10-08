import { Key, useCallback, useEffect, useState } from "react";
import FileUpload from "../forms/file-uploader";
import UniversalFileViewer from "../UniversalFileViewer";

export default function FileInput({ element, validationData }) {
  const {
    register = () => ({}),
    setValue,
    isReadOnly,
    watch,
    getValues,
  } = validationData || {};

  const watchedValue = typeof watch === "function" ? watch(element?.id) : undefined;
  const formValue = typeof getValues === "function" ? getValues(element?.id) : undefined;

  const [fileData, setFileData] = useState(
    watchedValue !== undefined
      ? watchedValue
      : formValue !== undefined
        ? formValue
        : element?.value ?? null,
  );

  const effectiveValue =
    watchedValue !== undefined
      ? watchedValue
      : formValue !== undefined
        ? formValue
        : fileData !== undefined && fileData !== null
          ? fileData
          : element?.value ?? null;

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  useEffect(() => {
    if (watch) {
      const subscription = watch((values: { [x: string]: any }) => {
        if (values && values[element.id] !== undefined) {
          setFileData(values[element.id]);
        }
      });
      return () => subscription.unsubscribe?.(); // clean up if watch returns a subscription (e.g., react-hook-form)
    }
  }, [watch, element.id]);

  const handleFileLoaded = useCallback(
    (data: any) => {
      setValue?.(element.id, data);
      setFileData(data);
    },
    [element.id, setValue],
  );

  const handleDeleteFile = () => {
    setValue?.(element.id, null);
    setFileData(null);
  };

  const parseFiles = (val: any) => {
    if (!val) return null;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return null;
      }
    }
    return Array.isArray(val) ? val : [val];
  };

  const parsedFileList = parseFiles(effectiveValue);

  return (
    <div className="w-full min-w-0 max-w-full">
      {!isReadOnly && (
        <FileUpload
          onFileLoaded={handleFileLoaded}
          disabled={isReadOnly}
          multiple={element?.isMultiple}
          handleDeleteFile={handleDeleteFile}
          list={parsedFileList}
          accept={element?.acceptedFiles}
          maxFileSize={element?.maxFileSize || 5}
        />
      )}
      {isReadOnly && (
        <>
          {parsedFileList && parsedFileList.length > 0 ? (
            <div className="relative grid gap-y-1 flex-1 w-full min-w-0 max-w-full">
              {parsedFileList.map(
                (
                  file: { base64: any; name: any },
                  index: Key | null | undefined,
                ) => (
                  <div key={index} className="w-full min-w-0 max-w-full">
                    <UniversalFileViewer
                      fileUrl={file.base64}
                      fileName={file.name}
                    />
                  </div>
                ),
              )}
            </div>
          ) : (
            <span className="field-control !bg-gray-50 w-full !text-gray-400 !text-sm !italic ">
              No File Uploaded
            </span>
          )}
        </>
      )}
    </div>
  );
}
