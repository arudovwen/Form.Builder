import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = []

const questionDa = [
    {
        "title": "",
        "description": "",
        "id": "68f53028-890d-4c74-9e69-dfacb4b8ab53",
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
                "type": "multiSelect",
                "label": "Multi Select",
                "icon": "fluent-mdl2:multi-select",
                "inputLabel": "Select Text Label",
                "inputType": "select",
                "options": [
                    {
                        "label": "Placeholder 1",
                        "value": "6",
                        "id": "9c7b7f7c-f60e-47d0-8c23-0123a24fe896"
                    },
                    {
                        "label": "6656",
                        "value": "uy",
                        "id": "e892a077-82f2-4da7-8cc9-09648e20a8c8"
                    }
                ],
                "id": "1c4e6baa-e665-4b0e-aaf7-b4bed19ef478",
                "sectionId": "68f53028-890d-4c74-9e69-dfacb4b8ab53",
                "dateType": "basic",
                "selectType": "list",
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
                "maxLength": null,
                "minLength": null,
                "placeholder": "Type here",
                "requiredMessage": "Field is required",
                "minLengthMessage": "",
                "maxLengthMessage": "",
                "type": "checkbox",
                "label": "Checkbox",
                "icon": "mingcute:checkbox-line",
                "inputLabel": "Checkbox Label",
                "inputType": "checkbox",
                "options": [
                    {
                        "label": "Checkbox Option",
                        "value": "ggegew",
                        "id": "299a8f2f-7b55-4137-880b-fe9dd2962a5e"
                    },
                    {
                        "label": "Two",
                        "value": "two",
                        "id": "abb34a77-22b9-45eb-8202-168ea4774fa6"
                    }
                ],
                "id": "e94355d4-b1b4-4ed8-b3e1-aabd68192679",
                "sectionId": "68f53028-890d-4c74-9e69-dfacb4b8ab53",
                "dateType": "basic",
                "selectType": "list",
                "options1": [],
                "dataColumns": []
            }
        ],
        "disabled": false
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
