import { useState, useContext, useEffect } from "react";
import EditorContext from "../../context/editor-context";
import PreviewModalModal from "./preview-modal";
import { getItem } from "../../utils/localStorageControl";
import BackSvg from "../../assets/svgs/back";
import AppIcon from "../ui/AppIcon";

interface TopBarProps {
  title?: string;
  goBackUrl?: () => void;
  onSubmit?: (data: any, settings?: any) => void;
  onPublish?: (data: any, settings?: any) => void;
  previewLoading?: boolean;
  saveLoading?: boolean;
  publishLoading?: boolean;
  onTitleChange?: (newTitle: string) => void;
  viewMode?: "canvas" | "flow";
  setViewMode?: (mode: "canvas" | "flow") => void;
  onShowVersion?: () => void;
}

export default function TopBar({
  title,
  goBackUrl,
  onSubmit,
  onPublish,
  previewLoading,
  saveLoading,
  publishLoading,
  onTitleChange,
  viewMode = "canvas",
  setViewMode,
  onShowVersion,
}: TopBarProps) {
  const {
    formData,
    setShowPreview,
    showPreview,
    undo,
    redo,
    canUndo,
    canRedo,
    deviceView = "desktop",
    setDeviceView,
    formTitle,
    setFormTitle,
    formSettings,
  }: any = useContext(EditorContext);

  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const currentTitle = title || formTitle || "Customer Onboarding & Product Feedback";
  const [editableTitle, setEditableTitle] = useState(currentTitle);
  const config = getItem("config") || {};

  useEffect(() => {
    if (title) {
      setEditableTitle(title);
    } else if (formTitle) {
      setEditableTitle(formTitle);
    }
  }, [title, formTitle]);

  function handleSubmit() {
    try {
      localStorage.setItem("formData", JSON.stringify(formData));
      if (formSettings) {
        localStorage.setItem("formSettings", JSON.stringify(formSettings));
      }
    } catch (e) {
      console.warn("Could not save formData to localStorage", e);
    }
    onSubmit?.(formData, formSettings);
  }

  function handlePublish() {
    try {
      localStorage.setItem("formData", JSON.stringify(formData));
      if (formSettings) {
        localStorage.setItem("formSettings", JSON.stringify(formSettings));
      }
    } catch (e) {
      console.warn("Could not save formData to localStorage", e);
    }
    onPublish?.(formData, formSettings);
  }

  function handleTitleBlur() {
    setEditing(false);
    const trimmed = editableTitle.trim();
    if (trimmed) {
      setFormTitle?.(trimmed);
      if (onTitleChange && trimmed !== title) {
        onTitleChange(trimmed);
      }
    } else {
      setEditableTitle(title || "Customer Onboarding & Product Feedback");
    }
  }

  return (
    <header className="px-5 py-2.5 flex justify-between items-center bg-white border-b border-gray-200/90 h-full select-none">
      {/* Left: Brand Icon & Title */}
      <div className="flex items-center gap-3">
        {goBackUrl && (
          <button
            type="button"
            onClick={() => goBackUrl()}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go back"
          >
            <BackSvg />
          </button>
        )}

        {/* Brand Icon */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs shrink-0">
          <AppIcon icon="solar:document-text-bold" iconClass="text-lg" />
        </div>

        {/* Title & Status */}
        <div className="flex items-center gap-2">
          {editing ? (
            <input
              type="text"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
              autoFocus
              className="px-2 py-0.5 text-sm font-semibold text-gray-900 border border-indigo-500 rounded-md outline-none bg-indigo-50/20"
            />
          ) : (
            <div
              onClick={() => setEditing(true)}
              className="group flex items-center gap-1.5 cursor-pointer py-1 px-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Click to edit title"
            >
              <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
                {editableTitle}
              </h1>
              <AppIcon
                icon="lucide:pencil"
                iconClass="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}

          {/* Status Badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Saved
          </span>
        </div>
      </div>

      {isOpen && (
        <PreviewModalModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          element={undefined}
        />
      )}

      {/* Middle: Device Preview Switcher, Undo/Redo & View Mode */}
      <div className="flex items-center gap-3">
        {/* Device Switcher (Desktop, Tablet, Mobile) */}
        {viewMode === "canvas" && setDeviceView && (
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200/80 shadow-xs">
            <button
              type="button"
              onClick={() => setDeviceView("desktop")}
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                deviceView === "desktop"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title="Desktop View (Full Width)"
            >
              <AppIcon icon="lucide:monitor" iconClass="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView("tablet")}
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                deviceView === "tablet"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title="Tablet View"
            >
              <AppIcon icon="lucide:tablet" iconClass="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView("mobile")}
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                deviceView === "mobile"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title="Mobile View"
            >
              <AppIcon icon="lucide:smartphone" iconClass="text-sm" />
            </button>
          </div>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${
              !canUndo ? "opacity-35 cursor-not-allowed" : "hover:text-gray-900"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <AppIcon icon="material-symbols:undo" iconClass="text-base" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${
              !canRedo ? "opacity-35 cursor-not-allowed" : "hover:text-gray-900"
            }`}
            title="Redo (Ctrl+Y)"
          >
            <AppIcon icon="material-symbols:redo" iconClass="text-base" />
          </button>
        </div>

        {/* View Mode (Builder / Flow) */}
        {setViewMode && (
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200/80 shadow-xs text-xs">
            <button
              type="button"
              onClick={() => setViewMode("canvas")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === "canvas"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <AppIcon icon="mdi:view-dashboard-outline" iconClass="text-sm" />
              Builder
            </button>
            <button
              type="button"
              onClick={() => setViewMode("flow")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === "flow"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <AppIcon icon="mdi:sitemap-outline" iconClass="text-sm" />
              Flow
            </button>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {onShowVersion && (
          <button
            type="button"
            onClick={onShowVersion}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            title="Version History"
          >
            <AppIcon icon="tabler:history" iconClass="text-sm" />
            <span className="hidden md:inline">History</span>
          </button>
        )}

        {/* Preview Button */}
        <button
          type="button"
          onClick={() => setShowPreview((prev: boolean) => !prev)}
          disabled={previewLoading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 shadow-xs transition-colors flex items-center gap-1.5"
        >
          <AppIcon
            icon={showPreview ? "iconamoon:eye-off-duotone" : "solar:eye-bold-duotone"}
            iconClass="text-sm text-gray-500"
          />
          <span>{showPreview ? "Hide Preview" : "Preview"}</span>
        </button>

        {/* Fullscreen Viewer Link */}
        <a
          href="/viewer"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 shadow-xs transition-colors flex items-center gap-1.5"
          title="Open Respondent Form Viewer in new tab"
        >
          <AppIcon icon="solar:square-top-down-linear" iconClass="text-sm text-gray-500" />
          <span className="hidden sm:inline">Open Viewer</span>
        </a>

        {/* Save Draft Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saveLoading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 shadow-xs transition-colors flex items-center gap-1.5"
        >
          <AppIcon icon="lets-icons:save-duotone" iconClass="text-sm text-gray-500" />
          <span>Save</span>
        </button>

        {/* Publish Button */}
        <button
          type="button"
          onClick={handlePublish}
          disabled={publishLoading}
          style={{ background: config?.buttonColor || "#4f46e5" }}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-1.5"
        >
          {publishLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <AppIcon icon="lucide:send" iconClass="text-xs" />
          )}
          <span>Publish</span>
        </button>

      </div>
    </header>
  );
}
