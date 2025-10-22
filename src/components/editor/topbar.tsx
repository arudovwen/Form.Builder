import { useState, useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import PreviewModalModal from "./preview-modal";
import { getItem } from "../../utils/localStorageControl";
import BackSvg from "../../assets/svgs/back";

export default function TopBar({
  title,
  goBackUrl,
  onSubmit,
  onPublish,
  previewLoading,
  saveLoading,
  publishLoading,
  onTitleChange,
}: {
  title: string;
  goBackUrl: () => void;
  onSubmit?: (e: any) => void;
  onPublish?: (e: any) => void;
  previewLoading?: boolean;
  saveLoading?: boolean;
  publishLoading?: boolean;
  onTitleChange?: (newTitle: string) => void;
}) {
  const { formData }: any = useContext(EditorContext);
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
    <div className="px-[30px] py-3 flex justify-between items-center bg-[#F9F9FB] top_bar">
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

      <div className="flex justify-end text-xs gap-x-3">
        <AppButton
          onClick={() => setOpen(true)}
          text="Preview"
          btnClass="px-2  bg-transparent font-medium text-sm form_preview"
          icon="solar:eye-bold-duotone"
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
          btnClass="border-[#98A2B3] font-medium text-sm py-[8px] px-6 text-white rounded-lg form_publish__btn"
          isDisabled={publishLoading}
          isLoading={publishLoading}
        />
      </div>
    </div>
  );
}
