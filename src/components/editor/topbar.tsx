import { useState, useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import PreviewModalModal from "./preview-modal";
import { getItem } from "../../utils/localStorageControl";
import BackSvg from "../../assets/svgs/back";
import AppIcon from "../ui/AppIcon";

interface TopBarProps {
  title: string;
  goBackUrl: () => void;
  onSubmit?: (e: any) => void;
  onPublish?: (e: any) => void;
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
  viewMode,
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
  }: any = useContext(EditorContext);
  const [isOpen, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title || "");
  const config = getItem("config");

  function handleSubmit() {
    localStorage.setItem("formData", JSON.stringify(formData));
    onSubmit?.(formData);
  }

  function handlePublish() {
    localStorage.setItem("formData", JSON.stringify(formData));
    onPublish?.(formData);
  }

  function handleTitleBlur() {
    setEditing(false);
    if (onTitleChange && editableTitle !== title) {
      onTitleChange(editableTitle.trim());
    }
  }

  return (
    <div className="px-[30px] py-3 flex justify-between items-center bg-[#F9F9FB] top_bar border-b h-full">
      <span className="flex items-center gap-x-2">
        {goBackUrl && (
          <button
            type="button"
            onClick={() => goBackUrl()}
            style={{ color: config?.buttonColor || "#333" }}
            className="flex items-center gap-x-3"
          >
            <BackSvg />
          </button>
        )}{" "}
        {editing ? (
          <input
            type="text"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            onBlur={handleTitleBlur}
            autoFocus
            className="w-48 px-2 py-1 text-sm font-semibold outline-gray-100 input form_title"
          />
        ) : (
          <h1
            title="Click to edit"
            className="text-base font-semibold cursor-pointer form_title"
            onClick={() => setEditing(true)}
          >
            {editableTitle || "Untitled"}
          </h1>
        )}
      </span>

      {isOpen && (
        <PreviewModalModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          element={undefined}
        />
      )}

      <div className="flex justify-end text-xs gap-x-3 items-center">
        {setViewMode && (
          <div className="flex border border-gray-300 rounded-lg overflow-hidden h-[36px] text-sm font-medium shadow-sm mr-2">
            <button
              type="button"
              style={{ color: config?.buttonColor || "#333" }}
              className={`px-3 flex items-center gap-1.5 transition-colors canvas_view ${viewMode === "canvas" ? "bg-white   font-medium" : "bg-gray-100 text-gray-500 hover:bg-gray-50"}`}
              onClick={() => setViewMode("canvas")}
            >
              <AppIcon
                icon="mdi:view-dashboard-outline"
                iconClass="text-base"
              />{" "}
              Builder
            </button>
            <button
              type="button"
              style={{ color: config?.buttonColor || "#333" }}
              className={`px-3 flex items-center gap-1.5 border-l border-gray-300 transition-colors flow_view ${viewMode === "flow" ? " bg-white  font-medium" : "bg-gray-100  text-gray-500 hover:bg-gray-50"}`}
              onClick={() => setViewMode("flow")}
            >
              <AppIcon icon="mdi:sitemap-outline" iconClass="text-base" /> Flow
            </button>
          </div>
        )}
        <AppButton
          onClick={undo}
          text=""
          btnClass={`!px-2 bg-transparent undo ${!canUndo ? "opacity-50" : ""}`}
          icon="material-symbols:undo"
          iconClass="text-xl !mr-0"
          style={{ color: config?.buttonColor || "#333" }}
          isDisabled={!canUndo}
        />
        <AppButton
          onClick={redo}
          text=""
          btnClass={`!px-2 bg-transparent redo ${!canRedo ? "opacity-50" : ""}`}
          icon="material-symbols:redo"
          iconClass="text-xl !mr-0"
          style={{ color: config?.buttonColor || "#333" }}
          isDisabled={!canRedo}
        />
        {onShowVersion && (
          <AppButton
            onClick={onShowVersion}
            text="Versions"
            btnClass="px-2  bg-transparent font-medium text-sm version_btn"
            icon="tabler:history"
            iconClass="text-xl"
            style={{ color: config?.buttonColor || "#333" }}
          />
        )}
        <AppButton
          onClick={() => setShowPreview((prev) => !prev)}
          text={showPreview ? "Hide Preview" : "Preview"}
          btnClass="px-2  bg-transparent font-medium text-sm form_preview"
          icon={
            showPreview ? "iconamoon:eye-off-duotone" : "solar:eye-bold-duotone"
          }
          iconClass="text-base"
          style={{ color: config?.buttonColor || "#333" }}
          isDisabled={previewLoading}
          isLoading={previewLoading}
        />
        <AppButton
          onClick={handleSubmit}
          text="Save"
          btnClass="px-2  bg-transparent font-medium text-sm form_save__btn"
          icon="lets-icons:save-duotone"
          iconClass="text-base"
          style={{ color: config?.buttonColor || "#333" }}
          isDisabled={saveLoading}
          isLoading={saveLoading}
        />
        <AppButton
          onClick={handlePublish}
          text="Publish"
          style={{ background: config?.buttonColor || "#333" }}
          btnClass="border-[#98A2B3] font-medium text-sm py-2 px-6 text-white rounded-lg form_publish__btn"
          isDisabled={publishLoading}
          isLoading={publishLoading}
        />
      </div>
    </div>
  );
}
