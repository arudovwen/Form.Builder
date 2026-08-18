import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
    {
        "id": "8db0ab19-6747-44ea-879f-ae1af2d14cd6",
        "value": "Samsung Galaxy A06 6.7\" 4GB RAM/128GB ROM Android 14 - Black",
        "sectionId": "3da74f65-4a2d-4bec-90e6-db1736fb5663",
        "type": "selectField",
        "metaData": {}
    }
]
import { demoPollApiResponse, demoQuestionDa } from "./demo-data";

const questionDa = [
    {
        "title": "",
        "description": "",
        "id": "3da74f65-4a2d-4bec-90e6-db1736fb5663",
        "questionData": [
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
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "matrix",
                "label": "Likert Scale",
                "icon": "pepicons-pop:list",
                "inputLabel": "Matrix Label",
                "inputType": "matrix",
                "options": [
                    {
                        "id": "r1",
                        "label": "Example Row",
                        "value": "row_1"
                    }
                ],
                "options1": [
                    {
                        "id": "c1",
                        "label": "Strongly Disagree",
                        "value": "strongly_disagree"
                    },
                    {
                        "id": "c2",
                        "label": "Disagree",
                        "value": "disagree"
                    },
                    {
                        "id": "c3",
                        "label": "Neutral",
                        "value": "neutral"
                    },
                    {
                        "id": "c4",
                        "label": "Agree",
                        "value": "agree"
                    },
                    {
                        "id": "c5",
                        "label": "Strongly Agree",
                        "value": "strongly_agree"
                    }
                ],
                "id": "5bf51a77-a598-490b-8aa6-0086e4049de7",
                "sectionId": "3da74f65-4a2d-4bec-90e6-db1736fb5663",
                "isDeleted": true
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
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "polling",
                "label": "Polling",
                "icon": "mdi:poll",
                "inputLabel": "Poll Label",
                "inputType": "polling",
                "options": [
                    {
                        "label": "Option 1",
                        "value": "option_1",
                        "id": "ad8c944d-bbbc-4a42-8af8-687ff94a39cf"
                    },
                    {
                        "label": "Option 2",
                        "value": "option_2",
                        "id": "fee30fdd-6c99-4ad0-9db6-353a9ce767c9"
                    }
                ],
                "fetchExternalResults": false,
                "externalApiUrl": "",
                "id": "aaf9c332-72ff-42b3-a246-5701c375020f",
                "sectionId": "3da74f65-4a2d-4bec-90e6-db1736fb5663",
                "isDeleted": true
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
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "selectField",
                "label": "List",
                "icon": "tabler:select",
                "inputLabel": "Select Text Label",
                "inputType": "select",
                "selectType": "list",
                "options": [
                    {
                        "label": "Placeholder 1",
                        "value": "placeholder_1",
                        "id": "d05b209a-9408-4daf-ae92-7ece1799170a"
                    }
                ],
                "id": "8db0ab19-6747-44ea-879f-ae1af2d14cd6",
                "sectionId": "3da74f65-4a2d-4bec-90e6-db1736fb5663",
                "dateType": "basic",
                "apiUrl": "https://dev.gateway.matta.trade/market/v1/External/product-list-dropdown?PageNumber=1&PageSize=10",
                "options1": [],
                "dataColumns": []
            }
        ],
        "disabled": false,
        "isHidden": false
    }
];
const pollApiResponse = demoPollApiResponse;
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
                  console.log(e);
                }}
                onPublish={function (e: any): void {
                  console.log(e);
                }}
                onChange={(updatedFormData) => {
                  // This will trigger immediately every time an element is added,
                  // removed, reordered, or edited inside the builder.
                  console.log("Form updated!", updatedFormData);
                }}
                onLogAction={(action, value) => {
                  console.log(`[FormBuilder Log] Action: ${action}`, value);
                }}
                questionData={questionDa}
                config={config}
                title="Form Title"
                goBackUrl={() => undefined}
                onAddTemplate={() => alert("Add template clicked!")}
                onShowVersion={() => alert(" teonShowVersionmplate clicked!")}
                deleteMode="isDeleted"
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
                console.log(e);
              }}
              answerData={answerData}
              form_data={questionDa}
              config={config}
              loading={false}
              renderType={"multi"}
              onGetValues={(val: any) => {
                console.log(val);
              }}
              // showResults={true}
              // pollResults={pollResultsMap}
              uploadUrl="https://beta.api.gateway.thetaskforge.co/edms/v1/fileupload/upload-document"
            >
              {/* <div className="text-center w-full">
                <p>This is a child component</p>
              </div> */}
            </ViewerPage>
          }
        />
      </Routes>
    </>
  );
}

export default App;
