import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [];

const questionDa = [
    {
        "title": "",
        "description": "",
        "id": "98b7dcce-3cc8-4a70-9326-0e6b2dbbbd21",
        "questionData": [
            {
                "type": "textField",
                "label": "Text Field",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "required": false,
                "inputType": "text",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "6e89d186-87a9-4960-84bd-74dab519d464",
                "sectionId": "98b7dcce-3cc8-4a70-9326-0e6b2dbbbd21"
            },
            {
                "type": "textField",
                "label": "Text Field",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "required": false,
                "inputType": "text",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "44859e97-921e-4abe-ada2-0ebfedd79f43",
                "sectionId": "98b7dcce-3cc8-4a70-9326-0e6b2dbbbd21"
            },
            {
                "type": "textField",
                "label": "Text Field",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "required": false,
                "inputType": "text",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "84689fd8-2711-400f-9c2d-46a04d519bbd",
                "sectionId": "98b7dcce-3cc8-4a70-9326-0e6b2dbbbd21"
            },
            {
                "type": "textField",
                "label": "Text Field",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "required": false,
                "inputType": "text",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "9ddb407d-8f2a-4d3e-a223-9ab1843ad11a",
                "sectionId": "98b7dcce-3cc8-4a70-9326-0e6b2dbbbd21"
            }
        ]
    },
    {
        "title": "",
        "description": "",
        "id": "f5fa94dd-fc44-4760-9028-965ac17efc8d",
        "questionData": [
            {
                "type": "validateInput",
                "label": "Validate Input",
                "icon": "iconoir:www",
                "inputLabel": "Validate Input Label",
                "required": false,
                "inputType": "validateInput",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Value is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "url": "https://api.example.com/validate?value={value}",
                "method": "GET",
                "responseType": "string",
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "083a698e-7e5e-44f8-889c-5d83d89a0226",
                "sectionId": "f5fa94dd-fc44-4760-9028-965ac17efc8d"
            },
            {
                "type": "validateInput",
                "label": "Validate Input",
                "icon": "iconoir:www",
                "inputLabel": "Validate Input Label",
                "required": false,
                "inputType": "validateInput",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Value is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "url": "https://api.example.com/validate?value={value}",
                "method": "GET",
                "responseType": "string",
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "7b7373db-f81d-4837-83f2-b1bb98aa342e",
                "sectionId": "f5fa94dd-fc44-4760-9028-965ac17efc8d"
            },
            {
                "type": "validateInput",
                "label": "Validate Input",
                "icon": "iconoir:www",
                "inputLabel": "Validate Input Label",
                "required": false,
                "inputType": "validateInput",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Value is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "url": "https://api.example.com/validate?value={value}",
                "method": "GET",
                "responseType": "string",
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "3b17bfbd-620a-446c-8223-37c05f13b10d",
                "sectionId": "f5fa94dd-fc44-4760-9028-965ac17efc8d"
            },
            {
                "type": "validateInput",
                "label": "Validate Input",
                "icon": "iconoir:www",
                "inputLabel": "Validate Input Label",
                "required": false,
                "inputType": "validateInput",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Value is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "url": "https://api.example.com/validate?value={value}",
                "method": "GET",
                "responseType": "string",
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "id": "6fb74cf0-9599-4cbd-af08-1c8e50dae555",
                "sectionId": "f5fa94dd-fc44-4760-9028-965ac17efc8d"
            }
        ]
    },
    {
        "title": "",
        "description": "",
        "id": "67e49246-1ea0-4740-85c2-49c22d4cb48a",
        "questionData": [
            {
                "type": "numberField",
                "label": "Number",
                "icon": "octicon:number-16",
                "inputLabel": "Number Label",
                "required": false,
                "inputType": "number",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "description": "",
                "isReadOnly": false,
                "isDisabled": false,
                "isRequired": false,
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "value": null,
                "customClass": "",
                "elementClass": "",
                "gridPosition": null,
                "gridId": null,
                "inputMode": "decimal",
                "id": "ac66501a-51f9-4ccb-9337-e89459cef753",
                "sectionId": "67e49246-1ea0-4740-85c2-49c22d4cb48a"
            }
        ]
    }
];
function App() {
  // let form_data;

  // // Safely parse formData from localStorage
  // try {
  //   const storedData = localStorage.getItem("formData");
  //   form_data = storedData ? JSON.parse(storedData) : null;
  // } catch (error) {
  //   console.error("Error parsing formData from localStorage:", error);
  //   form_data = null;
  // }
  const config = {
    buttonColor: "blue",
    loaderColor: "blue",
    elementColor: "blue",
    elementBgColor: "",
    elementBorderColor: "blue",
  };
  return (
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
          />
        }
      />
    </Routes>
  );
}

export default App;
