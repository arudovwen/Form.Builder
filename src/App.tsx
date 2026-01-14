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
        "id": "e15f1b41-dc83-4e97-b5e0-ecc2a65f3711",
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
                "visibilityDependentFields": "",
                "visibilityDependentFieldsValue": "",
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "numberField",
                "label": "Number",
                "icon": "octicon:number-16",
                "inputLabel": "Number Label",
                "inputType": "number",
                "inputMode": "decimal",
                "id": "5a240a2d-ce17-45b1-9349-8932fed3896c",
                "sectionId": "e15f1b41-dc83-4e97-b5e0-ecc2a65f3711"
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
                "visibilityDependentFields": "",
                "visibilityDependentFieldsValue": "",
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
                "id": "0803be88-1bae-4839-a338-9bacaee8a821",
                "sectionId": "e15f1b41-dc83-4e97-b5e0-ecc2a65f3711"
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
                "isHidden": true,
                "visibilityDependentFields": [
                    {
                        "id": "0803be88-1bae-4839-a338-9bacaee8a821",
                        "value": "0803be88-1bae-4839-a338-9bacaee8a821",
                        "label": "Amount",
                        "sectionId": "e15f1b41-dc83-4e97-b5e0-ecc2a65f3711",
                        "fieldType": "text",
                        "operator": "equals",
                        "fieldValue": "1"
                    },
                    {
                        "id": "5a240a2d-ce17-45b1-9349-8932fed3896c",
                        "value": "5a240a2d-ce17-45b1-9349-8932fed3896c",
                        "label": "Number",
                        "sectionId": "e15f1b41-dc83-4e97-b5e0-ecc2a65f3711",
                        "fieldType": "text",
                        "operator": "equals",
                        "fieldValue": "2"
                    }
                ],
                "visibilityDependentFieldsValue": "",
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
                "id": "2280939a-16ce-4d28-8138-5570ba24e45d",
                "sectionId": "e15f1b41-dc83-4e97-b5e0-ecc2a65f3711",
                "dateType": "basic",
                "selectType": "list",
                "options1": [],
                "options": [],
                "dataColumns": []
            }
        ]
    }
]
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
            onGetValues={(val: any) => {
              console.log(val);
            }}
          />
        }
      />
    </Routes>
  );
}

export default App;
