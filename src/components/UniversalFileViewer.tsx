import React, { useState, useEffect } from "react";
import AppIcon from "./ui/AppIcon";

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "image",
];
const ICONS = {
  pdf: "/pdf-icon.png",
  word: "/word-icon.png",
  excel: "/excel-icon.png",
  powerpoint: "/ppt-icon.png",
  other: "/file-icon.png",
};

const getFileType = (url = "") => {
  const ext = url.split(".").pop()?.toLowerCase() || "";
  if (IMAGE_EXTENSIONS.includes(ext) || url.startsWith("data:image/"))
    return "image";
  if (ext === "pdf" || url.startsWith("data:application/pdf")) return "pdf";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["xls", "xlsx", "csv"].includes(ext)) return "excel";
  if (["ppt", "pptx"].includes(ext)) return "powerpoint";
  return "other";
};
const FileIcon: Record<string, string> = {
  pdf: "vscode-icons:file-type-pdf2",
  word: "vscode-icons:file-type-word",
  excel: "vscode-icons:file-type-excel",
  powerpoint: "vscode-icons:file-type-powerpoint2",
};
export default function UniversalFileViewer({ fileUrl, fileName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileType, setFileType] = useState("unknown");
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (fileUrl) setFileType(getFileType(fileUrl));
  }, [fileUrl]);

  useEffect(() => {
    if (fileType === "pdf" && fileUrl?.startsWith("data:")) {
      try {
        const byteString = atob(fileUrl.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error creating blob URL:", error);
      }
    } else {
      setBlobUrl(null);
    }
  }, [fileUrl, fileType]);

  const handleFileClick = () => {
    if (fileType === "image" || fileType === "pdf") {
      setIsModalOpen(true);
    } else {
      window.open(blobUrl || fileUrl, "_blank");
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const icon = ICONS[fileType] || ICONS.other;
  const fileLabel = fileName || fileUrl?.split("/").pop() || "Unknown file";
  function downloadFile(fileUrl, fileName = "download") {
    if (!fileUrl) return;

    // For base64 data URLs
    if (fileUrl.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For normal URLs or blob URLs
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="mt-2 field-control !py-1 !bg-gray-50 !flex justify-between gap-x-8 items-center">
      <div
        onClick={handleFileClick}
        className="!flex items-center rounded cursor-pointer   gap-x-3"
        title={`Click to preview ${fileLabel}`}
      >
        {fileType === "image" && (
          <div className="flex items-center justify-center mb-2 w-14 h-14">
            <img
              src={icon}
              alt={`${fileType} icon`}
              className="max-w-full max-h-full"
            />
          </div>
        )}
        {fileType !== "image" && (
          <AppIcon icon={FileIcon[fileType]} iconClass="text-4xl" />
        )}
        <span className="text-sm font-semibold text-center text-gray-700 truncate">
          {fileLabel}
        </span>
      </div>
      <button
        type="button"
        className="p-2"
        onClick={() => downloadFile(blobUrl || fileUrl, fileName)}
          title={`Download ${fileLabel}`}
      >
        <AppIcon icon="streamline-flex:download-tray-solid" />
      </button>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-8 rounded-lg w-full max-w-[90vw] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute text-2xl font-bold text-gray-700 top-2 right-2"
              aria-label="Close preview"
            >
              &times;
            </button>

            {fileType === "image" ? (
              <img
                src={fileUrl}
                alt={fileLabel}
                className="max-w-full max-h-[80vh] mx-auto object-contain"
              />
            ) : fileType === "pdf" ? (
              <iframe
                src={blobUrl || fileUrl}
                title={fileLabel}
                className="w-full h-[80vh] rounded border"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
