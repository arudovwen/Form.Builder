import React, { useContext, useState } from "react";
import FormRenderer from "../viewer";
import EditorContext, { EditorProvider } from "../../context/editor-context";
import { getItem } from "../../utils/localStorageControl";
import { devLog } from "../../utils/logger";
import AppIcon from "../ui/AppIcon";
import "./preview.css";

export interface FormPreviewProps {
  activeMode?: "multi" | "single" | "conversational";
  onModeChange?: (mode: "multi" | "single" | "conversational") => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  activeMode,
  onModeChange,
}) => {
  const { formData, uploadUrl, deleteMode, formSettings } = useContext(
    EditorContext,
  ) as any;

  const [internalMode, setInternalMode] = useState<
    "multi" | "single" | "conversational"
  >(formSettings?.renderType || "multi");

  const previewMode = activeMode || internalMode;

  const handleSelectMode = (mode: "multi" | "single" | "conversational") => {
    setInternalMode(mode);
    onModeChange?.(mode);
  };

  const config = getItem("config") || {};

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/60">
      {/* Mode Selector Pill */}
      <div className="px-4 py-3 border-b border-gray-200/80 bg-white flex items-center justify-center shrink-0">
        <div className="flex bg-gray-100/90 p-1 rounded-xl text-xs font-semibold w-full max-w-[420px]">
          <button
            type="button"
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              previewMode === "multi"
                ? "bg-white shadow-xs text-indigo-600 font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => handleSelectMode("multi")}
            title="Multi-Step Wizard"
          >
            <AppIcon icon="solar:layers-linear" iconClass="text-sm" />
            <span className="truncate">Multi-Step</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              previewMode === "single"
                ? "bg-white shadow-xs text-indigo-600 font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => handleSelectMode("single")}
            title="Single Page Form"
          >
            <AppIcon icon="solar:document-text-linear" iconClass="text-sm" />
            <span className="truncate">Single</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              previewMode === "conversational"
                ? "bg-white shadow-xs text-indigo-600 font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => handleSelectMode("conversational")}
            title="Conversational Chat Mode"
          >
            <AppIcon icon="solar:chat-round-line-linear" iconClass="text-sm" />
            <span className="truncate">Chat Preview</span>
          </button>
        </div>
      </div>

      {/* Interactive Form Stage */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full relative flex flex-col items-center">
        {previewMode === "conversational" ? (
          <div className="w-full max-w-3xl transition-all">
            <EditorProvider
              deleteMode={deleteMode || config?.deleteMode || "remove"}
            >
              <FormRenderer
                form_data={formData}
                ignoreValidation={false}
                uploadUrl={
                  uploadUrl ||
                  "https://beta.api.gateway.thetaskforge.co/edms/v1/fileupload/upload-document"
                }
                renderType="conversational"
                onGetValues={(e: any) => devLog(e)}
                preview={true}
                submitText={formSettings?.submitText || "Submit"}
              />
            </EditorProvider>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs transition-all">
            <EditorProvider
              deleteMode={deleteMode || config?.deleteMode || "remove"}
            >
              <FormRenderer
                form_data={formData}
                ignoreValidation={false}
                uploadUrl={
                  uploadUrl ||
                  "https://beta.api.gateway.thetaskforge.co/edms/v1/fileupload/upload-document"
                }
                renderType={previewMode}
                onGetValues={(e: any) => devLog(e)}
                preview={true}
                submitText={formSettings?.submitText || "Submit"}
              />
            </EditorProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPreview;
