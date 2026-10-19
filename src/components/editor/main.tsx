import EditorContext from "../../context/editor-context";
import FormBuilder from ".";
import React, { useCallback, useContext, useEffect, Suspense } from "react";
import Loader from "../Loader";

// Lazy load the LogicFlow component
const LogicFlow = React.lazy(() => import("./logic-flow"));

export default function MainPage({
  initialFormData,
  uploadUrl,
  onAddTemplate,
  templates,
  viewMode = "canvas",
}: {
  initialFormData: any[];
  isReadOnly?: boolean;
  uploadUrl?: string;
  onAddTemplate?: () => void;
  templates?: any[];
  viewMode?: "canvas" | "flow";
}) {
  const { setFormData, addSection, setUploadUrl, formData }: any =
    useContext(EditorContext);

  useEffect(() => {
    if (initialFormData && initialFormData.length > 0) {
      setFormData(initialFormData);
    }
  }, [initialFormData, setFormData]);

  useEffect(() => {
    setUploadUrl(uploadUrl);
  }, [uploadUrl, setUploadUrl]);

  const handleMainDrop = useCallback(
    (e: any) => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData("properties"));
        if (data?.type === "section") {
          addSection();
          return;
        }
      } catch (err) {
        console.error("Drop error:", err);
      }
    },
    [addSection],
  );

  return (
    <div className="w-full h-full">
      {viewMode === "canvas" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleMainDrop(e)}
          className="w-full h-full form_builder"
        >
          <FormBuilder onAddTemplate={onAddTemplate} templates={templates} />
        </div>
      ) : (
        <Suspense fallback={<Loader loadingClass="!w-full !h-full" />}>
          <LogicFlow formData={formData} />
        </Suspense>
      )}
    </div>
  );
}
