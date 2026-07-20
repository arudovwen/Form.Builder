import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
  {
    id: "f67b5247-f19d-42fb-84e0-5531ee26baa2",
    value: "placeholder",
    sectionId: "b8843b62-d71d-4ce9-8ff8-dd831d4e0763",
    type: "selectField",
    metaData: {},
  },
];

const questionDa = [
  {
    title: "",
    description: "",
    id: "b8843b62-d71d-4ce9-8ff8-dd831d4e0763",
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
        type: "selectField",
        label: "List",
        icon: "tabler:select",
        inputLabel: "Select Text Label",
        inputType: "select",
        selectType: "list",
        options: [
          {
            label: "Placeholder 1",
            value: "placeholder_1",
            id: "55bc597a-0383-46c5-a4d4-2a641fe2a955",
          },
          {
            label: "ugt97880i",
            value: "ugt97880i",
            id: "1e919332-ca11-47bc-b457-19220f6078eb",
          },
          {
            label: "utfy8ufgviuy",
            value: "utfy8ufgviuy",
            id: "f0901772-20da-40af-92bf-1811ea261b50",
          },
        ],
        id: "f67b5247-f19d-42fb-84e0-5531ee26baa2",
        sectionId: "b8843b62-d71d-4ce9-8ff8-dd831d4e0763",
        dateType: "basic",
        options1: [],
        dataColumns: [],
      },
    ],
    disabled: false,
    isHidden: false,
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
                onChange={(updatedFormData) => {
                  // This will trigger immediately every time an element is added,
                  // removed, reordered, or edited inside the builder.
                  console.log("Form updated!", updatedFormData);
                }}
                onLogAction={(action, value) => {
                  console.log(`[FormBuilder Log] Action: ${action}`, value);
                }}
                questionData={questionDa}
                config={config}
                title="Form Title"
                goBackUrl={() => undefined}
                onAddTemplate={() => alert("Add template clicked!")}
                onShowVersion={() => alert(" teonShowVersionmplate clicked!")}
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
              uploadUrl="https://beta.api.gateway.thetaskforge.co/edms/v1/fileupload/upload-document"
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
