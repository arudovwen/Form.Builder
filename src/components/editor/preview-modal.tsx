import { FormViewer } from "../../";
import React, { useContext } from "react";
import EditorContext from "../../context/editor-context";
import { EditorContextType } from "./element-canvas";
import { getItem } from "../../utils/localStorageControl";
import "./preview.css";
import CloseSvg from "../../assets/svgs/close";
interface PreviewModalModalProps {
  isOpen: boolean;
  onClose: () => void;
  element: any;
}

const PreviewModalModal: React.FC<PreviewModalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { formData, uploadUrl } = useContext(
    EditorContext,
  ) as unknown as EditorContextType;
  if (!isOpen) return null;
  const config = getItem("config");
  
  return (
    <div className="fixed inset-0  flex  justify-center z-[999] cursor-default no-drag select-none w-screen h-screen pt-20 bg-[#F8F9FC]">
      <button
        type="button"
        onClick={onClose}
        className="absolute text-sm top-3 right-4"
        aria-label="close"
      >
        <CloseSvg />
      </button>{" "}
      <div className="max-h-[80vh] overflow-y-auto  h-max  w-full max-w-[650px] min-w-0 border border-[#D5D9EB] rounded-lg    bg-white form_submit">
        <FormViewer
          form_data={formData}
          ignoreValidation={true}
          config={config}
          uploadUrl={uploadUrl}
        />
      </div>
    </div>
  );
};

export default PreviewModalModal;
