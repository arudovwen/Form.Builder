import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
  {
    id: "a807ba99-9585-4bb5-8a52-6f2e3766bd1f",
    value: "placeholder_1",
    sectionId: "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    type: "selectField",
    metaData: {},
  },
  {
    id: "2320bfc3-1515-4c5b-806a-1c4b10304846",
    value: 2,
    sectionId: "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    type: "numberField",
    metaData: {},
  },
  {
    id: "fd208b91-d289-47fd-a1fd-b9dbeab09aa3",
    value: "g",
    sectionId: "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    type: "selectField",
    metaData: {},
  },
  {
    id: "88f038e8-68a8-4c94-bb15-45d7a670d5be",
    value: "true",
    sectionId: "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    type: "selectField",
    metaData: {},
  },
  {
    id: "de98882d-a3c4-4c0c-b621-76bac995d517",
    value: ["placeholder_1", "fdbhdth", "shedrthjetjetjnet"],
    sectionId: "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    type: "multiSelect",
    metaData: {},
  },
];
import { demoPollApiResponse, demoQuestionDa } from "./demo-data";

const questionDa = demoQuestionDa;
const pollApiResponse = demoPollApiResponse;
const pollResultsMap = pollApiResponse.data.submissionsData.reduce(
  (acc, curr) => {
    acc[curr.fieldId] = curr;
    return acc;
  },
  {} as Record<string, any>,
);

function App() {
  const config = {
    buttonColor: "#6366f1",
    loaderColor: "#6366f1",
    elementColor: "#6366f1",
    elementBgColor: "#ffffff",
    elementBorderColor: "#e5e7eb",
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
                deleteMode="isDeleted"
                // formType="poll"
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
              showResults={true}
              pollResults={pollResultsMap}
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
