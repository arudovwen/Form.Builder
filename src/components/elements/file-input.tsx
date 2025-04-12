import { useEffect, useState } from "react";
import FileUpload from "../forms/file-uploader";
import UniversalFileViewer from "../UniversalFileViewer";

export default function FileInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const [fileData, setFileData] = useState<any>(element?.value ?? null);
  const { register = () => ({}), setValue, isReadOnly } = validationData || {};
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  return (
    <div>
      <FileUpload
        onFileLoaded={(data) => {
          setValue(element.id, data);
          setFileData(data);
        }}
        disabled={isReadOnly}
      />
      {fileData && (
        <UniversalFileViewer
          fileUrl={fileData.base64}
          fileName={fileData.name}
        />
      )}
    </div>
  );
}
