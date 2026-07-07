import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [];

const questionDa = [
    {
        "title": "",
        "description": "",
        "id": "b8843b62-d71d-4ce9-8ff8-dd831d4e0763",
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
                "type": "file",
                "label": "File",
                "icon": "ion:attach-sharp",
                "inputLabel": "File Label",
                "inputType": "file",
                "isMultiple": false,
                "acceptedFiles": [],
                "id": "163781e2-96e2-45dd-b85d-f754420b11b8",
                "sectionId": "b8843b62-d71d-4ce9-8ff8-dd831d4e0763"
            }
        ],
        "disabled": false,
        "isHidden": false
    }
];

function App() {
  const config = {
    buttonColor: "blue",
    loaderColor: "blue",
    elementColor: "blue",
    elementBgColor: "",
    elementBorderColor: "blue",
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
