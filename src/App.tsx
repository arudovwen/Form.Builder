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
                formData={questionDa}
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
              answerData={answerData}
              form_data={[
    {
        "title": "",
        "description": "",
        "id": "362a75c4-6646-48e8-bfd8-3db982b2defa",
        "formData": [
            {
                "required": false,
                "description": "",
                "value": null,
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "isHidden": false,
                "visibilityDependentFields": [],
                "filterByFieldId": "",
                "clearOnFilterChange": true,
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "textField",
                "label": "Text Input",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "4c2c514e-dab7-432c-a594-c332c0ca4e01",
                "sectionId": "362a75c4-6646-48e8-bfd8-3db982b2defa"
            },
            {
                "required": false,
                "description": "",
                "value": null,
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "isHidden": false,
                "visibilityDependentFields": [],
                "filterByFieldId": "",
                "clearOnFilterChange": true,
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "amountField",
                "label": "Amount",
                "icon": "carbon:currency",
                "inputLabel": "Enter amount",
                "inputType": "amount",
                "prefix": null,
                "id": "0d038f73-8477-496a-82a7-d2d782c9d613",
                "sectionId": "362a75c4-6646-48e8-bfd8-3db982b2defa"
            },
            {
                "required": false,
                "description": "",
                "value": null,
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "isHidden": false,
                "visibilityDependentFields": [],
                "filterByFieldId": "4c2c514e-dab7-432c-a594-c332c0ca4e01",
                "clearOnFilterChange": true,
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "selectField",
                "label": "List",
                "icon": "tabler:select",
                "inputLabel": "Countries",
                "inputType": "select",
                "selectType": "list",
                "options": [
                    {
                        "label": "Nigeria",
                        "value": "nigeria",
                        "id": "798dc13a-10ce-40ed-a27a-9c34036b11f7",
                        "filterValue": "country",
                        "key": "country"
                    },
                    {
                        "label": "Ghana",
                        "value": "ghana",
                        "filterValue": "country",
                        "key": "country",
                        "id": "e12a03e4-4a9a-46ee-ab77-f85ea309e94f"
                    },
                    {
                        "label": "Edo",
                        "value": "edo",
                        "filterValue": "state",
                        "key": "state",
                        "id": "13957fac-b7ea-4738-8f8a-8abb801b8270"
                    }
                ],
                "id": "23caf72e-6add-44e7-8bd0-76acb854fb8d",
                "sectionId": "362a75c4-6646-48e8-bfd8-3db982b2defa",
                "dateType": "basic",
                "selectionType": "multiple",
                "options1": [],
                "dataColumns": []
            },
            {
                "required": false,
                "description": "",
                "value": null,
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "isHidden": false,
                "visibilityDependentFields": [],
                "filterByFieldId": "",
                "clearOnFilterChange": true,
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "email",
                "label": "Email",
                "icon": "mdi:email-outline",
                "inputLabel": "Email Label",
                "inputType": "email",
                "id": "8a28dfac-203e-4d79-90a1-e5e7745663f3",
                "sectionId": "362a75c4-6646-48e8-bfd8-3db982b2defa"
            }
        ],
        "disabled": false,
        "isHidden": false
    }
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
