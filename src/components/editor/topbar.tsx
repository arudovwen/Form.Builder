import { useState, useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import PreviewModalModal from "./preview-modal";
import { useNavigate } from "react-router";
import AppIcon from "../ui/AppIcon";

export default function TopBar({
  title,
  backUrl,
}: {
  title: string;
  backUrl: string;
}) {
  const { addSection }: any = useContext(EditorContext);
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="px-[30px] py-[10px] flex justify-between items-center bg-[#F9F9FB]">
      <span className="flex items-center gap-x-[6px]">
        {" "}
        {backUrl && (
          <button type="button" onClick={() => navigate(backUrl)}>
            <AppIcon icon="cuida:arrow-left-outline" />
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
      <div className="py-4 flex justify-end gap-x-6 text-base">
        <AppButton
          onClick={() => addSection()}
          text="Add section"
          btnClass="text-gray-700 border-[#98A2B3] !font-medium bg-transparent"
          icon="icon-park-outline:plus"
        />
        <AppButton
          onClick={() => setOpen(true)}
          text="Preview"
          btnClass="text-gray-700 border-[#98A2B3] !font-medium"
          icon="solar:eye-bold-duotone"
        />
      </div>
    </div>
  );
}
