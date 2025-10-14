import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
 {
    "id": "a215be09-db2b-4961-95a1-e6806c205310",
    "value": "+234-24352352523523536",
    "sectionId": "22ed8377-fdc4-4688-a2a8-7ea4c0c28f0a",
    "type": "phoneField"
}
]

const questionDa = [
  {
    "title": "",
    "description": "",
    "id": "22ed8377-fdc4-4688-a2a8-7ea4c0c28f0a",
    "questionData": [
        {
            "type": "phoneField",
            "label": "Phone Number",
            "icon": "fluent-mdl2:add-phone",
            "inputLabel": "Phone Label",
            "required": false,
            "inputType": "tel",
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
            "inputMode": "tel",
            "pattern": "^\\+?[0-9]{7,15}$",
            "id": "a215be09-db2b-4961-95a1-e6806c205310",
            "sectionId": "22ed8377-fdc4-4688-a2a8-7ea4c0c28f0a"
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
  const config = {
    buttonColor: "green",
    loaderColor: "green",
    elementColor: "green",
    elementBgColor: "",
    elementBorderColor: "green",
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
