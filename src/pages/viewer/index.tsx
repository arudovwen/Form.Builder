import { ReactNode, useEffect } from "react";
import Loader from "../../components/Loader";
import FormRenderer from "../../components/viewer";
import { setItem } from "../../utils/localStorageControl";

export interface RenderProps {
  onSubmit?: (e: any) => void; // Function to handle form submission
  answerData?: any; // Data for the questions in the form
  isReadOnly?: boolean; // Flag to indicate if the form is read-only
  form_data?: any; // Data for the form structure
  ignoreValidation?: boolean; // Flag to ignore validation
  loading?: boolean; // Flag to indicate if the form is loading
  config?: any; // Configuration for the form
  renderType?: "multi" | "single";
  children?: ReactNode;
  hideFooter?: boolean
}

export default function Viewer({
  answerData,
  form_data,
  ignoreValidation,
  onSubmit,
  isReadOnly = false,
  loading = false,
  config = {
    buttonColor: "#333",
  },
  renderType,
  children,
  hideFooter
}: RenderProps) {
  useEffect(() => {
    if (config) {
      setItem("config", config);
    }
  }, [config]);
  if (loading) {
    return <Loader />;
  }
  // Render fallback if form_data is unavailable
  if (!form_data) {
    return (
      <div>
        <p className="p-6 text-gray-400 tex-sm">Error: No form data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <FormRenderer
        form_data={form_data}
        answerData={answerData}
        ignoreValidation={ignoreValidation}
        onSubmitData={onSubmit}
        isReadOnly={isReadOnly}
        renderType={renderType}
        children={children}
        hideFooter={hideFooter}
      />
    </div>
  );
}
