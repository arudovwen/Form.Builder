import { ReactNode, useEffect, useCallback } from "react";
import Loader from "../../components/Loader";
import FormRenderer from "../../components/viewer";
import { setItem } from "../../utils/localStorageControl";

export interface RenderProps {
  onSubmit?: (e: any) => void;
  answerData?: any;
  isReadOnly?: boolean;
  form_data?: any;
  ignoreValidation?: boolean;
  loading?: boolean;
  config?: any;
  renderType?: "multi" | "single";
  children?: ReactNode;
  hideFooter?: boolean;
  onGetValues?: (e: any) => void;
}

export default function Viewer({
  answerData,
  form_data,
  ignoreValidation,
  onSubmit,
  isReadOnly = false,
  loading = false,
  config = { buttonColor: "#333" },
  renderType,
  children,
  hideFooter,
  onGetValues,
}: RenderProps) {
  // ✅ Store config in localStorage only when it changes
  useEffect(() => {
    if (config) setItem("config", config);
  }, [config]);

  // ✅ Stabilize onGetValues reference
  const stableOnGetValues = useCallback(
    (vals: any) => {
      if (onGetValues) onGetValues(vals);
    },
    [onGetValues]
  );

  if (loading) return <Loader />;

  if (!form_data) {
    return (
      <div>
        <p className="p-6 text-sm text-gray-400">
          Error: No form data available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div id="root-portal"></div>
      <FormRenderer
        form_data={form_data}
        answerData={answerData}
        ignoreValidation={ignoreValidation}
        onSubmitData={onSubmit}
        isReadOnly={isReadOnly}
        renderType={renderType}
        hideFooter={hideFooter}
        onGetValues={stableOnGetValues} // ✅ stable reference
      >
        {children}
      </FormRenderer>
    </div>
  );
}
