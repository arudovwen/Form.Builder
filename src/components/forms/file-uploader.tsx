import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import AppIcon from "../ui/AppIcon";
import UniversalFileViewer from "../UniversalFileViewer";
import { toast } from "react-toastify";

interface FileUploadProps {
  onFileLoaded: (
    data: Array<{ base64: string; type: string; name: string }>,
  ) => void;
  disabled?: boolean;
  handleDeleteFile?: () => void;
  multiple?: boolean;
  list: any;
  accept?: any[];
}

export default function FileUpload({
  onFileLoaded,
  disabled,
  handleDeleteFile,
  multiple = false,
  list,
  accept,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileData, setFileData] = useState(list ?? null);

  const acceptedFiles = useMemo(()=> accept?.map(i=>i.value).join(', '), [accept])
  const acceptedFileLabels = useMemo(()=> accept?.map(i=>i.label).join(', '), [accept])
  useEffect(() => {
    onFileLoaded(fileData);
  }, [fileData, onFileLoaded]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const fileList = Array.from(files);

    // File type restriction and max size validation
    const allowedTypes = acceptedFiles ? acceptedFiles.split(',').map(type => type.trim()) : [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = fileList.filter(file => {
      if (allowedTypes.length && !allowedTypes.some(type => type.includes(file.type)  || file.name.endsWith(type.replace('.', '')))) {
        return true;
      }
      if (file.size > maxSize) {
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      toast.error(`Some files are invalid. Allowed types: ${acceptedFileLabels || 'any'}, Max size: 5MB.`);
      return;
    }

    const promises = fileList.map(
      (file) =>
        new Promise<{ base64: string; type: string; name: string }>(
          (resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                base64: reader.result as string,
                type: file.type,
                name: file.name,
              });
            };
            reader.onerror = () => {
              reject(new Error("Failed to read file"));
            };
            reader.readAsDataURL(file);
          },
        ),
    );

    Promise.all(promises)
      .then((data) => {
        setFileData((prev) => (prev ? [...prev, ...data] : data));
      })
      .catch((err) => setError(err.message));
  };

  const removeFile = useCallback(
    (index?: number) => {
      // 🔹 Clear input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (index !== undefined) {
        // Remove specific file
        setFileData((prev) =>
          prev ? prev.filter((_, i) => i !== index) : null,
        );
      } else {
        // Clear all files
        setFileData(null);
      }

      setError(null);

      // 🔹 Notify parent if needed
      handleDeleteFile?.();
    },
    [handleDeleteFile],
  );

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="!flex field-control !py-0 !px-0">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
          multiple={multiple}
          accept={acceptedFiles || ""}
          className="w-full text-sm text-gray-500 file:mr-4 flex-1 file:px-4 !py-1 !pl-1
                     file:rounded-[6px] file:py-[6px] file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        {!disabled && fileData && fileData.length > 0 && (
          <button
            type="button"
            className="p-2 text-lg text-red-500"
            onClick={() => removeFile()}
          >
            <AppIcon icon="lets-icons:trash-duotone" />
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {fileData && (
        <div className="relative grid gap-y-1 flex-1 w-full">
          {fileData.map((file, index) => (
            <div key={index}>
              <UniversalFileViewer
                fileUrl={file.base64}
                fileName={file.name}
                removeFile={() => removeFile(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
