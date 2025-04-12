import "./App.css";

import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

const data = [
  {
      "title": "",
      "description": "",
      "id": "88643a76-74a9-43fa-b21e-c76472ca913d",
      "questionData": [
          {
              "id": "1d0c9683-7f06-4185-ba4a-34aa5bde6f44",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
              "type": "multiSelect",
              "label": "MultiSelect",
              "icon": "fluent-mdl2:multi-select",
              "inputLabel": "Select Text Label",
              "required": false,
              "inputType": "select",
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
              "options": [
                  {
                      "label": "wggg",
                      "value": "ggegew",
                      "id": "e9ffedcb-428b-470a-8f4b-d8c127dd23c0"
                  },
                  {
                      "label": "Two",
                      "value": "fwqf",
                      "id": "2f624678-0963-4757-808a-8d1f458fbc7f"
                  }
              ]
          },
          {
              "id": "a5ee0ecb-6897-47ae-8091-d54329e8a001",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
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
              "responseType": "string"
          },
          {
              "id": "ce9cf52a-c39d-4106-87bc-7780d847e6d2",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
              "type": "radio",
              "label": "Radio select",
              "icon": "ri:checkbox-circle-line",
              "inputLabel": "Radio Text Label",
              "required": false,
              "inputType": "radio",
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
              "options": [
                  {
                      "label": "Option 1",
                      "value": "1",
                      "id": "02f4676d-4991-4fd4-b500-e6f34a4dc8d9"
                  },
                  {
                      "label": "Option 2",
                      "value": "2",
                      "id": "0cdf1778-e2f8-483f-853f-58b3e36262ff"
                  }
              ]
          },
          {
              "id": "70d8ce22-c11f-49c9-8f8c-db98322f9b43",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
              "type": "tableInput",
              "label": "Table Input",
              "icon": "iconoir:table",
              "inputLabel": "Table Input Label",
              "required": false,
              "inputType": "tableInput",
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
              "value": [],
              "denominators": null
          }
      ]
  }
]

const answerData = [
  {
      "title": "",
      "description": "",
      "id": "88643a76-74a9-43fa-b21e-c76472ca913d",
      "questionData": [
          {
              "id": "1d0c9683-7f06-4185-ba4a-34aa5bde6f44",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
              "type": "multiSelect",
              "label": "MultiSelect",
              "icon": "fluent-mdl2:multi-select",
              "inputLabel": "Select Text Label",
              "required": false,
              "inputType": "select",
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
              "value": [
                  {
                      "label": "wggg",
                      "value": "ggegew",
                      "id": "e9ffedcb-428b-470a-8f4b-d8c127dd23c0"
                  },
                  {
                      "label": "Two",
                      "value": "fwqf",
                      "id": "2f624678-0963-4757-808a-8d1f458fbc7f"
                  }
              ],
              "options": [
                  {
                      "label": "wggg",
                      "value": "ggegew",
                      "id": "e9ffedcb-428b-470a-8f4b-d8c127dd23c0"
                  },
                  {
                      "label": "Two",
                      "value": "fwqf",
                      "id": "2f624678-0963-4757-808a-8d1f458fbc7f"
                  }
              ]
          },
          {
              "id": "a5ee0ecb-6897-47ae-8091-d54329e8a001",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
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
              "value": "431243125",
              "url": "https://api.example.com/validate?value={value}",
              "method": "GET",
              "responseType": "string"
          },
          {
              "id": "ce9cf52a-c39d-4106-87bc-7780d847e6d2",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
              "type": "radio",
              "label": "Radio select",
              "icon": "ri:checkbox-circle-line",
              "inputLabel": "Radio Text Label",
              "required": false,
              "inputType": "radio",
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
              "value": "2",
              "options": [
                  {
                      "label": "Option 1",
                      "value": "1",
                      "id": "02f4676d-4991-4fd4-b500-e6f34a4dc8d9"
                  },
                  {
                      "label": "Option 2",
                      "value": "2",
                      "id": "0cdf1778-e2f8-483f-853f-58b3e36262ff"
                  }
              ]
          },
          {
              "id": "70d8ce22-c11f-49c9-8f8c-db98322f9b43",
              "sectionId": "88643a76-74a9-43fa-b21e-c76472ca913d",
              "type": "tableInput",
              "label": "Table Input",
              "icon": "iconoir:table",
              "inputLabel": "Table Input Label",
              "required": false,
              "inputType": "tableInput",
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
              "value": [
                  {
                      "key": "960000",
                      "value": "4"
                  },
                  {
                      "key": "960000",
                      "value": "4"
                  }
              ],
              "denominators": [
                  {
                      "value": "960000"
                  },
                  {
                      "value": "960000"
                  }
              ],
              "options": []
          }
      ]
  }
]
function App() {
  let form_data;

  // Safely parse formData from localStorage
  try {
    const storedData = localStorage.getItem("formData");
    form_data = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error parsing formData from localStorage:", error);
    form_data = null;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <BulderPage
            onSubmit={function (e: any): void {
              console.log(e);
            }}
            questionData={data}
          />
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
            form_data={form_data}
          />
        }
      />
    </Routes>
  );
}

export default App;
