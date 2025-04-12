import Loader from "../../components/Loader";
import FormRenderer from "../../components/viewer";

export interface RenderProps {
  onSubmit?: (e: any) => void; // Function to handle form submission
  answerData?: any; // Data for the questions in the form
  isReadOnly?: boolean; // Flag to indicate if the form is read-only
  form_data?: any; // Data for the form structure
  ignoreValidation?: boolean; // Flag to ignore validation
  loading?: boolean; // Flag to indicate if the form is loading
}

export default function Viewer({
  answerData,
  form_data,
  ignoreValidation,
  onSubmit,
  isReadOnly = false,
  loading = false,
}: RenderProps) {
  if (loading) {
    return <Loader />;
  }
  // Render fallback if form_data is unavailable
  if (!form_data) {
    return (
      <div>
        <p>
          Error: No form data available. Please ensure the form data is saved
          correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <FormRenderer
        form_data={form_data}
        answerData={answerData}
        ignoreValidation={ignoreValidation}
        onSubmitData={onSubmit}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
