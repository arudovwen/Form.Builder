import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = [
  {
    title: "",
    description: "",
    id: "88643a76-74a9-43fa-b21e-c76472ca913d",
    questionData: [
      {
        id: "1d0c9683-7f06-4185-ba4a-34aa5bde6f44",
        sectionId: "88643a76-74a9-43fa-b21e-c76472ca913d",
        type: "multiSelect",
        label: "MultiSelect",
        icon: "fluent-mdl2:multi-select",
        inputLabel: "Select Text Label",
        required: false,
        inputType: "select",
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        description: "",
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        value: null,
        options: [
          {
            label: "wggg",
            value: "ggegew",
            id: "e9ffedcb-428b-470a-8f4b-d8c127dd23c0",
          },
          {
            label: "Two",
            value: "fwqf",
            id: "2f624678-0963-4757-808a-8d1f458fbc7f",
          },
        ],
      },
      {
        id: "a5ee0ecb-6897-47ae-8091-d54329e8a001",
        sectionId: "88643a76-74a9-43fa-b21e-c76472ca913d",
        type: "validateInput",
        label: "Validate Input",
        icon: "iconoir:www",
        inputLabel: "Validate Input Label",
        required: false,
        inputType: "validateInput",
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        description: "",
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        requiredMessage: "Value is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        value: null,
        url: "https://api.example.com/validate?value={value}",
        method: "GET",
        responseType: "string",
      },
      {
        id: "ce9cf52a-c39d-4106-87bc-7780d847e6d2",
        sectionId: "88643a76-74a9-43fa-b21e-c76472ca913d",
        type: "radio",
        label: "Radio select",
        icon: "ri:checkbox-circle-line",
        inputLabel: "Radio Text Label",
        required: false,
        inputType: "radio",
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        description: "",
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        value: null,
        options: [
          {
            label: "Option 1",
            value: "1",
            id: "02f4676d-4991-4fd4-b500-e6f34a4dc8d9",
          },
          {
            label: "Option 2",
            value: "2",
            id: "0cdf1778-e2f8-483f-853f-58b3e36262ff",
          },
        ],
      },
      {
        id: "70d8ce22-c11f-49c9-8f8c-db98322f9b43",
        sectionId: "88643a76-74a9-43fa-b21e-c76472ca913d",
        type: "tableInput",
        label: "Table Input",
        icon: "iconoir:table",
        inputLabel: "Table Input Label",
        required: false,
        inputType: "tableInput",
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        description: "",
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        requiredMessage: "Value is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        value: [],
        denominators: null,
      },
    ],
  },
];

const answerData = [
    {
        "id": "0fd58e1c-3ff4-43ed-a4fc-0bc35433961b",
        "value": "erq3wrq",
        "sectionId": "7580dbe9-7733-4356-8a9e-0f5054d0be00",
        "type": "textField"
    },
    {
        "id": "867fd1c9-431b-4eac-b90f-812de0561e40",
        "value": "qwrq",
        "sectionId": "7580dbe9-7733-4356-8a9e-0f5054d0be00",
        "type": "longText"
    },
    {
        "id": "8a5856dd-0a95-4065-97a0-6b3324440bd4",
        "sectionId": "7580dbe9-7733-4356-8a9e-0f5054d0be00",
        "type": "selectField"
    },
    {
        "id": "84501d9c-3edd-46a0-a83e-c92a2e4a7563",
        "value": "141414",
        "sectionId": "7580dbe9-7733-4356-8a9e-0f5054d0be00",
        "type": "validateInput"
    },
    {
        "id": "5f5a823c-94d9-4d62-a509-857ed140e4c5",
        "value": "rqrq",
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "validateInput"
    },
    {
        "id": "98292376-59aa-447c-b287-7128f70d72b7",
        "value": 33333,
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "numberField"
    },
    {
        "id": "9e09bad3-1dd2-496e-8816-4ec803425375",
        "value": "2025-04-14T23:00:00.000Z",
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "date"
    },
    {
        "id": "2cc8ff1c-123e-4a1f-9142-bc8713f59ad9",
        "value": "Arudovwen@17",
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "password"
    },
    {
        "id": "8b34148a-9f50-4ab2-90ce-20dcf4962553",
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "radio"
    },
    {
        "id": "9bb90d58-9264-4a5a-91d0-694d58e9a718",
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "grid"
    },
    {
        "id": "b8d35c26-e91e-465b-af89-b8fc0bf0dec8",
        "value": [],
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "tableInput"
    },
    {
        "id": "51689b4c-4384-4ec7-8681-2b1ccb5a4d76",
        "value": "41414",
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "validateInput"
    },
    {
        "id": "eabfb8b2-51da-4d59-a947-027b53dd47f4",
        "value": "tw4t43",
        "sectionId": "4db3f32b-881b-4c34-bbaf-ff3352d958ed",
        "type": "longText"
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
    buttonColor: "#333",
    loaderColor: "#333",
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <BulderPage
            onSubmit={function (e: any): void {
              console.log(e);
            }}
            // questionData={data}
            config={config}
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
            config={config}
            loading={false}
            renderType={"multi"}
          />
        }
      />
    </Routes>
  );
}

export default App;
