import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import AppIcon from "../ui/AppIcon";
import UniversalFileViewer from "../UniversalFileViewer";
import { toast } from "sonner";
import EditorContext from "@/context/editor-context";
import axios from "axios";
import { getItem } from "@/utils/localStorageControl";

type FileItem = {
  base64: string;
  type: string;
  name: string;
};

interface FileUploadProps {
  onFileLoaded: (data: FileItem[] | null) => void;
  disabled?: boolean;
  handleDeleteFile?: () => void;
  multiple?: boolean;
  list?: FileItem[] | null;
  accept?: { value: string; label: string }[];
  maxFileSize?: number;
}

export default function FileUpload({
  onFileLoaded,
  disabled = false,
  handleDeleteFile,
  multiple = false,
  list = null,
  accept = [],
  maxFileSize = 5,
}: FileUploadProps) {
  const { uploadUrl, setApiActivityCount }: any = useContext(EditorContext);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileData, setFileData] = useState<FileItem[] | null>(list);
  const [isUploading, setIsUploading] = useState(false);

  // Sync fileData with list prop changes
  useEffect(() => {
    setFileData(list);
  }, [list]);

  const acceptedFiles = useMemo(
    () => accept?.map((i) => i.value).join(", "),
    [accept],
  );

  const acceptedFileLabels = useMemo(
    () => accept?.map((i) => i.label).join(", "),
    [accept],
  );

  const getFileUrl = useCallback(
    async (formData: { base64: string; ext: string; fileName: string }) => {
      const token = getItem("token");
      const orgId = getItem("orgData")?.id || getItem("organizationId");

      try {
        const { data } = await axios.post(
          uploadUrl,
          {
            ...formData,
            service: "FORM",
            organizationId: orgId || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            defaultMessage: "Failed to upload file(s). Please try again.",
          } as any,
        );

        return data?.data?.url;
      } catch (error) {
        console.error("File upload error:", error);
        throw error;
      }
    },
    [uploadUrl],
  );

  const uploadFile = useCallback(
    (file: File): Promise<FileItem> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
          try {
            const base64 = (reader.result as string).replace(
              /^data:.*;base64,/,
              "",
            );

            const result = uploadUrl
              ? await getFileUrl({
                  base64,
                  ext: `.${file.name.split(".").pop()}`,
                  fileName: file.name,
                })
              : (reader.result as string);

            resolve({
              base64: result,
              type: file.type,
              name: file.name,
            });
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      }),
    [uploadUrl, getFileUrl],
  );

  const validateFiles = useCallback(
    (files: File[]): boolean => {
      const allowedTypes = acceptedFiles
        ? acceptedFiles.split(",")?.map((t) => t.trim())
        : [];
      const limitBytes = maxFileSize * 1024 * 1024;

      for (const file of files) {
        if (file.size > limitBytes) {
          toast.error(
            `File "${file.name}" exceeds ${maxFileSize}MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
          );
          return false;
        }

        if (
          allowedTypes.length &&
          !allowedTypes.some((type) => {
            if (type.endsWith("/*")) {
              const baseType = type.split("/")[0];
              return file.type.startsWith(`${baseType}/`);
            }
            return (
              file.type === type ||
              file.name.toLowerCase().endsWith(type.replace("*", ""))
            );
          })
        ) {
          toast.error(
            `File "${file.name}" is not an allowed type. Allowed: ${acceptedFileLabels || "any"}`,
          );
          return false;
        }
      }

      return true;
    },
    [acceptedFiles, acceptedFileLabels, maxFileSize],
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      if (!files.length || isUploading) return;

      if (!validateFiles(files)) {
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      try {
        setIsUploading(true);
        setApiActivityCount?.((prev: number) => prev + 1);

        const uploaded = await Promise.all(files?.map(uploadFile));

        const updated =
          multiple && fileData ? [...fileData, ...uploaded] : uploaded;
        setFileData(updated);
        onFileLoaded(updated);

        toast.success(`Successfully uploaded ${files.length} file(s)`);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
        setApiActivityCount?.((prev: number) => Math.max(0, prev - 1));
        // Reset input to allow re-uploading the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [
      isUploading,
      validateFiles,
      uploadFile,
      onFileLoaded,
      multiple,
      fileData,
      setApiActivityCount,
    ],
  );

  const removeFile = useCallback(
    (index?: number) => {
      if (isUploading) return;

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setFileData((prev) => {
        const updated =
          index === undefined
            ? null
            : prev?.filter((_, i) => i !== index) || null;

        onFileLoaded(updated);
        return updated;
      });

      handleDeleteFile?.();
    },
    [handleDeleteFile, onFileLoaded, isUploading],
  );

  const hasFiles = fileData && fileData.length > 0;

  return (
    <div className="flex flex-col items-start gap-2">
      {!disabled && !(hasFiles && !multiple) && (
        <div className="!flex field-control !py-0 !px-0 relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            multiple={multiple}
            accept={acceptedFiles || ""}
            className="w-full text-sm text-gray-500 file:mr-4 flex-1 file:px-4 !py-1 !pl-1
                     file:rounded-[6px] file:py-[6px] file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100 disabled:opacity-80 disabled:cursor-not-allowed"
          />

          {hasFiles && (
            <button
              type="button"
              className="p-2 text-lg text-red-500 hover:text-red-600 transition-colors disabled:opacity-80"
              onClick={() => removeFile()}
              disabled={isUploading}
              aria-label="Remove all files"
            >
              <AppIcon icon="lets-icons:trash-duotone" />
            </button>
          )}
        </div>
      )}

      {(hasFiles || isUploading) && (
        <div className="relative grid gap-y-1 flex-1 w-full min-h-[40px]">
          {isUploading && (
            <div
              className={`z-10 flex items-center justify-center bg-white/60 rounded ${hasFiles ? "absolute inset-0" : "p-1 border border-dashed border-gray-300"}`}
            >
              <div className="flex items-center gap-x-2 text-xs text-blue-600 font-medium">
                <span className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full" />
                Uploading...
              </div>
            </div>
          )}

          {typeof fileData === "object" &&
            fileData?.map((file, index) => (
              <UniversalFileViewer
                key={`${file.name}-${index}`}
                fileUrl={file.base64}
                fileName={file.name}
                removeFile={() => removeFile(index)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
