import { FormViewer } from "../..";
import React, { useContext, useState } from "react";
import EditorContext from "../../context/editor-context";
import { EditorContextType } from "./element-canvas";
import { getItem } from "../../utils/localStorageControl";
import "./preview.css";

const FormPreview: React.FC = () => {
  const { formData, uploadUrl } = useContext(
    EditorContext,
  ) as unknown as EditorContextType;
  const [previewMode, setPreviewMode] = useState<"multi" | "conversational">("conversational");

  const config = getItem("config");

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-center p-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex bg-gray-200 p-1 rounded-lg text-sm font-medium">
          <button
            type="button"
            className={`px-4 py-1.5 rounded-md transition-all ${previewMode === "multi" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setPreviewMode("multi")}
          >
            Standard
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-md transition-all ${previewMode === "conversational" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setPreviewMode("conversational")}
          >
            Conversational
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto w-full relative">
        <FormViewer
          form_data={formData}
          ignoreValidation={true}
          config={config}
          uploadUrl={uploadUrl}
          renderType={previewMode}
          onGetValues={(e: any) => console.log(e)}
        />
      </div>
    </div>
  );
};

export default FormPreview;
