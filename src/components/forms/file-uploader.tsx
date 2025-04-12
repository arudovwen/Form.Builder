import React, { useState } from "react";

interface FileUploadProps {
  onFileLoaded: (data: { base64: string; type: string; name: string }) => void;
  disabled?: boolean;
}

export default function FileUpload({
  onFileLoaded,
  disabled,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      onFileLoaded({
        base64: base64String,
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

  return (
    <div className="flex flex-col items-start gap-2">
      <input
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        className="block w-full text-sm text-gray-500 file:mr-4  file:px-4  input-control !py-1 !pl-1
                  file:rounded-[6px] file:py-[6px] file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
