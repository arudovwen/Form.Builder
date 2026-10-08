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

function App() {
  const config = {
    buttonColor: "#6366f1",
    loaderColor: "#6366f1",
    elementColor: "#6366f1",
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
                onSubmit={function (e: any): void {
                  devLog("Builder submit:", e);
                }}
                onPublish={function (e: any): void {
                  devLog("Builder publish:", e);
                }}
                onChange={(updatedFormData) => {
                  devLog("Form updated!", updatedFormData);
                }}
                onLogAction={(action, value) => {
                  devLog(`[FormBuilder Log] Action: ${action}`, value);
                }}
                formData={[]}
                config={config}
                title="Form Title"
                goBackUrl={() => undefined}
                onAddTemplate={() => alert("Add template clicked!")}
                onShowVersion={() => alert(" teonShowVersionmplate clicked!")}
                deleteMode="soft"
                mode="create"
                // formType="poll"
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
              answerData={[
    {
        "id": "8ebb31a6-83cf-4074-ba34-6e65c42f9b46",
        "value": [
            "Plac",
            "placeholder_1"
        ],
        "sectionId": "0470cf02-007a-43d1-9d2d-7bccfc9e17af",
        "type": "multiSelect",
        "metaData": {}
    },
    {
        "id": "c8d3bddf-4234-424e-b24c-2b0f516bcb10",
        "value": "",
        "sectionId": "0470cf02-007a-43d1-9d2d-7bccfc9e17af",
        "type": "selectField",
        "metaData": {}
    }
]}
              form_data={[
                {
                  title: "",
                  description: "",
                  id: "0470cf02-007a-43d1-9d2d-7bccfc9e17af",
                  formData: [
                    {
                      required: false,
                      description: "",
                      value: null,
                      isReadOnly: false,
                      isDisabled: false,
                      isRequired: false,
                      customClass: "",
                      elementClass: "",
                      gridPosition: null,
                      gridId: null,
                      isHidden: false,
                      visibilityDependentFields: [],
                      filterByFieldId: "",
                      clearOnFilterChange: true,
                      maxLength: null,
                      minLength: null,
                      placeholder: "Type here",
                      requiredMessage: "Field is required",
                      minLengthMessage: "",
                      maxLengthMessage: "",
                      type: "selectField",
                      label: "List",
                      icon: "tabler:select",
                      inputLabel: "Select Text Label",
                      inputType: "select",
                      selectType: "Combobox",
                      options: [
                        {
                          label: "Placeholder 1",
                          value: "placeholder_1",
                          id: "63cb8818-583d-4100-bfae-ccb632db70a4",
                        },
                      ],
                      id: "d7de3eab-39af-4a65-9613-44bf351cf279",
                      sectionId: "0470cf02-007a-43d1-9d2d-7bccfc9e17af",
                      dateType: "basic",
                      selectionType: "multiple",
                      options1: [],
                      dataColumns: [],
                    },
                    {
                      required: false,
                      description: "",
                      value: null,
                      isReadOnly: false,
                      isDisabled: false,
                      isRequired: false,
                      customClass: "",
                      elementClass: "",
                      gridPosition: null,
                      gridId: null,
                      isHidden: false,
                      visibilityDependentFields: [],
                      filterByFieldId: "",
                      clearOnFilterChange: true,
                      maxLength: null,
                      minLength: null,
                      placeholder: "Type here",
                      requiredMessage: "Field is required",
                      minLengthMessage: "",
                      maxLengthMessage: "",
                      type: "multiSelect",
                      label: "Multi List",
                      icon: "fluent-mdl2:multi-select",
                      inputLabel: "Select Text Label",
                      inputType: "select",
                      minChecked: 1,
                      requireAllChecked: false,
                      options: [
                        {
                          label: "Placeholder 1",
                          value: "placeholder_1",
                          id: "87cc347f-ee1a-4e97-bc55-e80ed42f44bb",
                        },
                      ],
                      id: "8ebb31a6-83cf-4074-ba34-6e65c42f9b46",
                      sectionId: "0470cf02-007a-43d1-9d2d-7bccfc9e17af",
                    },
                  ],
                  disabled: false,
                  isHidden: false,
                },
              ]}
              config={config}
              loading={false}
              renderType={"multi"}
              onGetValues={(val: any) => {
                devLog("Viewer getValues:", val);
              }}
              // showResults={true}
              // hideInputsOnResults={true}
              // pollResults={pollResultsMap}
              uploadUrl="https://beta.api.gateway.thetaskforge.co/edms/v1/fileupload/upload-document"
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
