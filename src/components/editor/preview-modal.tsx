import { FormViewer } from "@/";
import React, { useContext } from "react";
import EditorContext from "../../context/editor-context";
import { EditorContextType } from "./element-canvas";
import { getItem } from "../../utils/localStorageControl";

interface PreviewModalModalProps {
  isOpen: boolean;
  onClose: () => void;
  element: any;
}

const PreviewModalModal: React.FC<PreviewModalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { formData } = useContext(
    EditorContext
  ) as unknown as EditorContextType;
  if (!isOpen) return null;
  const config = getItem("config");
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999] cursor-default no-drag select-none">
      <div className="max-w-[80vw]  bg-white rounded-xl shadow-xl relative flex flex-col items-center w-full  py-6 ">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 text-sm"
        >
          Close
        </button>
        <div className="max-h-[90vh] overflow-y-auto h-full min-h-[600px] w-full">
          <FormViewer
            form_data={formData}
            ignoreValidation={true}
            config={config}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewModalModal;
