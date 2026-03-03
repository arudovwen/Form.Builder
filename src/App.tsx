import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
    {
        "id": "dc871abd-c1b9-43b0-8448-7b0118f04476",
        "value": "tfygtiuy",
        "sectionId": "55f9edb1-2033-4a51-a4b5-b111622f3ecd",
        "type": "textField"
    },
    {
        "id": "bfaba3d7-97f1-40b0-b30b-d4d7759af02d",
        "value": "2",
        "sectionId": "55f9edb1-2033-4a51-a4b5-b111622f3ecd",
        "type": "selectField"
    }
]

const questionDa = [
    {
        "title": "",
        "description": "",
        "id": "3a76c324-49e7-4d95-9f6a-ea323adafb45",
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
                "type": "url",
                "label": "Link",
                "icon": "iconamoon:link",
                "inputLabel": "Url Link",
                "inputType": "url",
                "id": "0f751a61-bd0c-4109-942f-4d8472e7e2f7",
                "sectionId": "3a76c324-49e7-4d95-9f6a-ea323adafb45"
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
                "type": "email",
                "label": "Email",
                "icon": "mdi:email-outline",
                "inputLabel": "Email Label",
                "inputType": "email",
                "id": "41b5b059-7ddb-4583-a5a7-a6212be762fc",
                "sectionId": "3a76c324-49e7-4d95-9f6a-ea323adafb45"
            }
        ],
        "disabled": false
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
            renderType={"multi"}
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
