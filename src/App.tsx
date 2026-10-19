import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

import {
  demoPollApiResponse,
  demoQuestionDa,
  demoFormData,
  demoAnswerData,
} from "./demo-data";
import { devLog } from "./utils/logger";

const questionDa = demoFormData;
const pollApiResponse = demoPollApiResponse;
const answerData = demoAnswerData;
const pollResultsMap = pollApiResponse.data.submissionsData.reduce(
  (acc, curr) => {
    acc[curr.fieldId] = curr;
    return acc;
  },
  {} as Record<string, any>,
);

const initialSampleForm = [
  {
    id: "sec-onboarding-1",
    title: "Personal & Feedback Details",
    description: "Please share basic details and tell us about your experience.",
    disabled: false,
    isHidden: false,
    formData: [
      {
        id: "field-full-name",
        sectionId: "sec-onboarding-1",
        type: "textField",
        label: "Short Text",
        icon: "ri:text",
        inputLabel: "Full Name",
        inputType: "text",
        required: true,
        isRequired: true,
        placeholder: "e.g. Alex Morgan",
        description: "Your official name or handle.",
      },
      {
        id: "field-work-email",
        sectionId: "sec-onboarding-1",
        type: "email",
        label: "Email",
        icon: "fluent:mail-24-regular",
        inputLabel: "Work Email Address",
        inputType: "email",
        required: true,
        isRequired: true,
        placeholder: "alex@company.com",
        description: "We'll send your confirmation details here.",
      },
      {
        id: "field-company-size",
        sectionId: "sec-onboarding-1",
        type: "selectField",
        label: "Dropdown",
        icon: "ri:arrow-down-s-line",
        inputLabel: "Company Size",
        inputType: "select",
        required: false,
        placeholder: "Select your company size",
        options: [
          { id: "opt-1", label: "1 - 10 employees", value: "1_10" },
          { id: "opt-2", label: "11 - 50 employees", value: "11_50" },
          { id: "opt-3", label: "51 - 250 employees", value: "51_250" },
          { id: "opt-4", label: "250+ employees", value: "enterprise" },
        ],
      },
      {
        id: "field-product-rating",
        sectionId: "sec-onboarding-1",
        type: "rating",
        label: "Star Rating",
        icon: "solar:star-line-duotone",
        inputLabel: "How would you rate your recent experience?",
        inputType: "rating",
        required: true,
        isRequired: true,
        max: 5,
        description: "Rate from 1 to 5 stars.",
      },
      {
        id: "field-feedback-comments",
        sectionId: "sec-onboarding-1",
        type: "longText",
        label: "Long Text",
        icon: "fluent:text-paragraph-24-regular",
        inputLabel: "What features or improvements would you like to see?",
        inputType: "textarea",
        required: false,
        placeholder: "Share your thoughts, suggestions, or ideas...",
        description: "Your feedback helps shape our product improvements.",
      },
    ],
  },
];

function App() {
  const config = {
    buttonColor: "#4f46e5",
    loaderColor: "#4f46e5",
    elementColor: "#4f46e5",
    elementBgColor: "#ffffff",
    elementBorderColor: "#e5e7eb",
  };
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-screen">
              <BulderPage
                onSubmit={function (data: any, settings: any): void {
                  devLog("Builder submit data:", data, "settings:", settings);
                }}
                onPublish={function (data: any, settings: any): void {
                  devLog("Builder publish data:", data, "settings:", settings);
                }}
                onChange={(updatedFormData, settings) => {
                  devLog("Form updated!", updatedFormData, "settings:", settings);
                }}
                onLogAction={(action, value) => {
                  devLog(`[FormBuilder Log] Action: ${action}`, value);
                }}
                formData={initialSampleForm}
                config={config}
                title="Customer Onboarding & Product Feedback"
                description="Help us improve our service by providing feedback on your recent interaction."
                formSettings={{
                  title: "Customer Onboarding & Product Feedback",
                  description:
                    "Help us improve our service by providing feedback on your recent interaction.",
                  renderType: "multi",
                  submitText: "Submit Feedback",
                  buttonColor: "#4f46e5",
                  showProgressBar: true,
                  allowMultipleSubmissions: true,
                }}
                onTitleChange={(t) => devLog("Title changed:", t)}
                onDescriptionChange={(d) => devLog("Description changed:", d)}
                onFormSettingsChange={(s) => devLog("Form settings changed:", s)}
                goBackUrl={() => undefined}
                onAddTemplate={() => alert("Add template clicked!")}
                onShowVersion={() => alert("Version history clicked!")}
                deleteMode="soft"
                mode="edit"
              />
            </div>
          }
        />
        <Route
          path="/viewer"
          element={
            <ViewerPage
              onSubmit={function (e: any): void {
                devLog("Viewer submit:", e);
              }}
              form_data={initialSampleForm}
              title="Customer Onboarding & Product Feedback"
              config={config}
              loading={false}
              renderType="multi"
              onGetValues={(val: any) => {
                devLog("Viewer getValues:", val);
              }}
              uploadUrl="https://beta.api.gateway.thetaskforge.co/edms/v1/fileupload/upload-document"
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
