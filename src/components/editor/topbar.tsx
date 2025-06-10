import { useState, useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import PreviewModalModal from "./preview-modal";
import AppIcon from "../ui/AppIcon";
import { getItem } from "../../utils/localStorageControl";

const config = getItem("config");
export default function TopBar({
  title,
  goBackUrl,
  onSubmit,
}: {
  title: string;
  goBackUrl: () => void;
  onSubmit: (e: any) => void;
}) {
  const { addSection, formData }: any = useContext(EditorContext);
  const [isOpen, setOpen] = useState(false);

  function handleSubmit() {
    localStorage.setItem("formData", JSON.stringify(formData));
    onSubmit(formData);
  }
  return (
    <div className="px-[30px] py-3 flex justify-between items-center bg-[#F9F9FB] top_bar">
      <span className="flex items-center gap-x-[6px]">
        {" "}
        {!goBackUrl && (
          <button type="button" onClick={() => goBackUrl()}   style={{ color: config?.buttonColor || "#333" }}>
            <AppIcon icon="bxs:chevron-left-square" iconClass="text-2xl" />
          </button>
        )}{" "}
        <h1 className="text-base font-semibold form_title">{title || ""}</h1>
      </span>
      {isOpen && (
        <PreviewModalModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          element={undefined}
        />
      )}
      <div className="flex justify-end text-xs gap-x-6">
        <AppButton
          onClick={() => addSection()}
          text="Add section"
          btnClass=" !px-0 text-gray-700  !font-medium bg-transparent !text-sm form_section"
          icon="icon-park-outline:plus"
          iconClass="text-base"
          style={{ color: config?.buttonColor || "#333" }}
        />
        <AppButton
          onClick={() => setOpen(true)}
          text="Preview"
          btnClass="!px-0 text-gray-700 bg-transparent !font-medium !text-sm form_preview"
          icon="solar:eye-bold-duotone"
          iconClass="text-base"
          style={{ color: config?.buttonColor || "#333" }}
        />
        <AppButton
          onClick={() => handleSubmit()}
          text="Save Form"
          style={{ background: config?.buttonColor || "#333" }}
          btnClass={`border-[#98A2B3] !font-medium !text-sm !py-[8px] px-6 bg-blue-600 text-white rounded-lg form_save__btn`}
        />
      </div>
    </div>
  );
}
