import { FormViewer } from "../..";
import React, { useContext } from "react";
import EditorContext from "../../context/editor-context";
import { EditorContextType } from "./element-canvas";
import { getItem } from "../../utils/localStorageControl";
import "./preview.css";

const FormPreview: React.FC = () => {
  const { formData, uploadUrl } = useContext(
    EditorContext,
  ) as unknown as EditorContextType;

  const config = getItem("config");

  return (
    <FormViewer
      form_data={formData}
      ignoreValidation={true}
      config={config}
      uploadUrl={uploadUrl}
      renderType="multi"
      onGetValues={(e: any) => console.log(e)}
    />
  );
};

export default FormPreview;
