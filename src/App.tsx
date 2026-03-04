import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
  {
    id: "dc871abd-c1b9-43b0-8448-7b0118f04476",
    value: "tfygtiuy",
    sectionId: "55f9edb1-2033-4a51-a4b5-b111622f3ecd",
    type: "textField",
  },
  {
    id: "bfaba3d7-97f1-40b0-b30b-d4d7759af02d",
    value: "2",
    sectionId: "55f9edb1-2033-4a51-a4b5-b111622f3ecd",
    type: "selectField",
  },
];

const questionDa = [
  {
    title: "",
    description: "",
    id: "339a89dc-d9d1-45e9-8c6e-8df1c5c3a376",
    questionData: [
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        customClass: "",
        elementClass: "",
        gridPosition: null,
        gridId: null,
        isHidden: false,
        visibilityDependentFields: [],
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        type: "grid",
        label: "Grid",
        icon: "cuida:grid-outline",
        inputLabel: "",
        inputType: "grid",
        columns: 2,
        id: "6c40e388-36e2-433c-a6ff-7e13a78dec1b",
        sectionId: "339a89dc-d9d1-45e9-8c6e-8df1c5c3a376",
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        customClass: "",
        elementClass: "",
        gridPosition: {
          col: 1,
        },
        gridId: "6c40e388-36e2-433c-a6ff-7e13a78dec1b",
        isHidden: false,
        visibilityDependentFields: [],
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        type: "email",
        label: "Email",
        icon: "mdi:email-outline",
        inputLabel: "Email Label",
        inputType: "email",
        id: "a9c12cd4-bfa5-4e2b-89c4-67fdf7fae110",
        sectionId: "339a89dc-d9d1-45e9-8c6e-8df1c5c3a376",
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        customClass: "",
        elementClass: "",
        gridPosition: {
          col: 2,
        },
        gridId: "6c40e388-36e2-433c-a6ff-7e13a78dec1b",
        isHidden: false,
        visibilityDependentFields: [],
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        type: "email",
        label: "Email",
        icon: "mdi:email-outline",
        inputLabel: "Email Label",
        inputType: "email",
        id: "e8f309c0-5b16-451b-87cc-38eb3fc8593a",
        sectionId: "339a89dc-d9d1-45e9-8c6e-8df1c5c3a376",
      },
    ],
    disabled: false,
  },
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
    </>
  );
}

export default App;
