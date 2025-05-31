import { useState, useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import PreviewModalModal from "./preview-modal";
import AppIcon from "../ui/AppIcon";

export default function TopBar({
  title,
  backUrl,
}: {
  title: string;
  backUrl: string;
}) {
  const { addSection }: any = useContext(EditorContext);
  const [isOpen, setOpen] = useState(false);
  function gotoUrl() {
    window.location.href = backUrl;
  }
  return (
    <div className="px-[30px] py-3 flex justify-between items-center bg-[#F9F9FB] top_bar">
      <span className="flex items-center gap-x-[6px]">
        {" "}
        {backUrl && (
          <button type="button" onClick={() => gotoUrl()}>
            <AppIcon icon="mingcute:arrow-left-fill" />
          </button>
        )}{" "}
        <h1 className="font-semibold text-lg">{title || ""}</h1>
      </span>
      {isOpen && (
        <PreviewModalModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          element={undefined}
        />
      )}
      <div className="flex justify-end gap-x-6 text-xs">
        <AppButton
          onClick={() => addSection()}
          text="Add section"
          btnClass="text-gray-700  !font-medium bg-transparent !text-xs section"
          icon="icon-park-outline:plus"
        />
        <AppButton
          onClick={() => setOpen(true)}
          text="Preview"
          btnClass="text-gray-700 bg-transparent] !font-medium !text-xs preview"
          icon="solar:eye-bold-duotone"
        />
      </div>
    </div>
  );
}
