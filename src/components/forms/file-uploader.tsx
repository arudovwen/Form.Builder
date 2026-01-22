import React, { useRef, useState } from "react";
import AppIcon from "../ui/AppIcon";

interface FileUploadProps {
  onFileLoaded: (data: { base64: string; type: string; name: string }) => void;
  disabled?: boolean;
  handleDeleteFile?: () => void;
}

export default function FileUpload({
  onFileLoaded,
  disabled,
  handleDeleteFile,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      onFileLoaded({
        base64: reader.result as string,
        type: file.type,
        name: file.name,
      });
      setError(null);
    };

    reader.onerror = () => {
      setError("Failed to read file.");
    };

    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    // 🔹 Clear input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError(null);

    // 🔹 Notify parent if needed
    handleDeleteFile?.();
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="!flex field-control !py-0 !px-0">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
          className="w-full text-sm text-gray-500 file:mr-4 flex-1 file:px-4 !py-1 !pl-1
                     file:rounded-[6px] file:py-[6px] file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        {!disabled && fileInputRef.current?.value && (
          <button
            type="button"
            className="p-2 text-lg text-red-500"
            onClick={removeFile}
          >
            <AppIcon icon="lets-icons:trash-duotone" />
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
