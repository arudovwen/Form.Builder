import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [];

const questionDa = [
  // {
  //   title: "Seiiwh",
  //   description: "ewwrhe",
  //   id: "ede64630-ec5b-4153-9508-db4950d668ba",
  //   questionData: [
  //     {
  //       type: "textField",
  //       label: "Text Field",
  //       icon: "fluent:text-16-filled",
  //       inputLabel: "Text Label",
  //       required: false,
  //       inputType: "text",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Field is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: null,
  //       gridId: null,
  //       id: "417a0622-a5c0-46c3-9e27-a471ab0077a3",
  //       sectionId: "ede64630-ec5b-4153-9508-db4950d668ba",
  //       allowEdit: true,
  //     },

  //     {
  //       type: "grid",
  //       label: "Grid",
  //       icon: "cuida:grid-outline",
  //       inputLabel: "",
  //       inputType: "grid",
  //       placeholder: "Type here",
  //       description: "",
  //       columns: 2,
  //       id: "1353545d-3c26-45e8-88b9-1205744593be",
  //       sectionId: "ede64630-ec5b-4153-9508-db4950d668ba",
  //     },
  //     {
  //       type: "textField",
  //       label: "Text Field",
  //       icon: "fluent:text-16-filled",
  //       inputLabel: "Text Label",
  //       required: false,
  //       inputType: "text",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Field is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: {
  //         col: 1,
  //       },
  //       gridId: "1353545d-3c26-45e8-88b9-1205744593be",
  //       id: "20854bb1-9af0-4eb9-a2d0-0a40a10ed238",
  //       sectionId: "ede64630-ec5b-4153-9508-db4950d668ba",
  //       allowEdit: true,
  //     },
  //     {
  //       type: "textField",
  //       label: "Text Field",
  //       icon: "fluent:text-16-filled",
  //       inputLabel: "Text Label",
  //       required: false,
  //       inputType: "text",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Field is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: {
  //         col: 2,
  //       },
  //       gridId: "1353545d-3c26-45e8-88b9-1205744593be",
  //       id: "bb80c881-56af-4a63-ad05-e10cdf31c7f7",
  //       sectionId: "ede64630-ec5b-4153-9508-db4950d668ba",
  //     },

  //     {
  //       type: "longText",
  //       label: "Long Text Field",
  //       icon: "dashicons:text",
  //       inputLabel: "Long Text Label",
  //       required: false,
  //       inputType: "text",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Field is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: null,
  //       gridId: null,
  //       id: "e8d7b501-baba-4709-8aba-011df4b9b96d",
  //       sectionId: "ede64630-ec5b-4153-9508-db4950d668ba",
  //       allowEdit: true,
  //     },
  //     {
  //       type: "longText",
  //       label: "Long Text Field",
  //       icon: "dashicons:text",
  //       inputLabel: "Long Text Label",
  //       required: false,
  //       inputType: "text",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Field is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: null,
  //       gridId: null,
  //       id: "b08c2ca2-9d6a-477b-8e48-7b1eb6fccc99",
  //       sectionId: "ede64630-ec5b-4153-9508-db4950d668ba",
  //     },
  //   ],
  // },
  // {
  //   title: "SAGAH",
  //   description: "HSH",
  //   id: "6be1ebdc-fa6e-4181-9fb6-1c692af3efef",
  //   questionData: [
  //     {
  //       type: "numberField",
  //       label: "Number",
  //       icon: "octicon:number-16",
  //       inputLabel: "Number Label",
  //       required: false,
  //       inputType: "number",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Field is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: null,
  //       gridId: null,
  //       inputMode: "decimal",
  //       id: "3c9b2eed-7806-4ea2-b0b2-41147a34ef3d",
  //       sectionId: "6be1ebdc-fa6e-4181-9fb6-1c692af3efef",
  //     },
  //     {
  //       type: "numberField",
  //       label: "Number",
  //       icon: "octicon:number-16",
  //       inputLabel: "Number Label",
  //       required: false,
  //       inputType: "number",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Field is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: null,
  //       gridId: null,
  //       inputMode: "decimal",
  //       id: "d702960b-4aab-4158-a1c0-8dfd326336db",
  //       sectionId: "6be1ebdc-fa6e-4181-9fb6-1c692af3efef",
  //     },
  //     {
  //       type: "validateInput",
  //       label: "Validate Input",
  //       icon: "iconoir:www",
  //       inputLabel: "Validate Input Label",
  //       required: false,
  //       inputType: "validateInput",
  //       maxLength: null,
  //       minLength: null,
  //       placeholder: "Type here",
  //       description: "",
  //       isReadOnly: false,
  //       isDisabled: false,
  //       isRequired: false,
  //       requiredMessage: "Value is required",
  //       minLengthMessage: "",
  //       maxLengthMessage: "",
  //       value: null,
  //       url: "https://api.example.com/validate?value={value}",
  //       method: "GET",
  //       responseType: "string",
  //       customClass: "",
  //       elementClass: "",
  //       gridPosition: null,
  //       gridId: null,
  //       id: "92b650bc-d5ea-4a30-9711-449d2884bc67",
  //       sectionId: "6be1ebdc-fa6e-4181-9fb6-1c692af3efef",
  //     },
  //   ],
  // },
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
            isReadOnly
          />
        }
      />
    </Routes>
  );
}

export default App;
