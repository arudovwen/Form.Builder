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
        "id": "1a0c1411-ad5a-433b-bca6-9ad47637344c",
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
                "type": "textField",
                "label": "Text Field",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "327c3434-9b2b-4033-9971-42dbfff19ae5",
                "sectionId": "1a0c1411-ad5a-433b-bca6-9ad47637344c"
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
                "type": "longText",
                "label": "Long Text Field",
                "icon": "dashicons:text",
                "inputLabel": "Long Text Label",
                "inputType": "text",
                "id": "2087a076-b84e-431a-bd66-f609a009b3f7",
                "sectionId": "1a0c1411-ad5a-433b-bca6-9ad47637344c"
            }
        ],
        "disabled": false,
        "isHidden": false
    },
    {
        "title": "",
        "description": "",
        "id": "f334b093-2167-407e-b104-c5f3050df951",
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
                "type": "textField",
                "label": "Text Field",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "125796d7-c2ad-4f07-ad7c-32cb5d3c845d",
                "sectionId": "f334b093-2167-407e-b104-c5f3050df951"
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
                "type": "textField",
                "label": "Text Field",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "7a1a2b85-3f8d-4458-8e1d-4c798ae14ec2",
                "sectionId": "f334b093-2167-407e-b104-c5f3050df951"
            }
        ],
        "disabled": true,
        "isHidden": false
    }
]
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
                // questionData={data}
                config={config}
                title="Form Title"
                goBackUrl={() => undefined}
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
              renderType={"single"}
              onGetValues={(val: any) => {
                console.log(val);
              }}
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
