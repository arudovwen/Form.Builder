import { useState, useContext } from "react";
import AppButton from "../ui/AppButton";
import EditorContext from "../../context/editor-context";
import PreviewModalModal from "./preview-modal";

export default function TopBar() {
  const { addSection }: any = useContext(EditorContext);

  const [isOpen, setOpen] = useState(false);

  return (
    <div className="px-[30px] py-[10px] flex justify-between items-center">
      <div className="flex gap-x-4  items-center"></div>
      {isOpen && (
        <PreviewModalModal
          isOpen={isOpen}
          onClose={() => setOpen(false)} element={undefined}        
        />
      )}
      <div className="py-4 flex justify-end gap-x-6 text-sm">
        <AppButton
          onClick={() => addSection()}
          text="Add section"
          btnClass="text-gray-700 border-[#98A2B3] !font-medium bg-transparent"
        />
        <AppButton
          onClick={() => setOpen(true)}
          text="Preview"
          btnClass="text-gray-700 border-[#98A2B3] !font-medium"
          
        />
      </div>
    </div>
  );
}
