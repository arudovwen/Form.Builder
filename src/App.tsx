import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
  {
    "id": "a807ba99-9585-4bb5-8a52-6f2e3766bd1f",
    "sectionId": "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    "type": "selectField",
    "value": "placeholder_1",
    "files": null,
    "metaData": {}
  },
  {
    "id": "2320bfc3-1515-4c5b-806a-1c4b10304846",
    "sectionId": "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    "type": "numberField",
    "value": "2",
    "files": null,
    "metaData": {}
  },
  {
    "id": "fd208b91-d289-47fd-a1fd-b9dbeab09aa3",
    "sectionId": "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    "type": "selectField",
    "value": "kg",
    "files": null,
    "metaData": {}
  },
  {
    "id": "88f038e8-68a8-4c94-bb15-45d7a670d5be",
    "sectionId": "7f1e6c3c-220d-4b6f-9756-baf328e6798b",
    "type": "selectField",
    "value": "true",
    "files": null,
    "metaData": {}
  }
];
    console.log(`🚀 ~ JSON.parse("kg"):`, JSON.parse("true"))

const questionDa = [{"title":"","description":"","id":"7f1e6c3c-220d-4b6f-9756-baf328e6798b","questionData":[{"required":false,"description":"","value":null,"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"selectField","label":"List","icon":"tabler:select","inputLabel":"Product","inputType":"select","selectType":"list","options":[{"label":"Placeholder 1","value":"placeholder_1","id":"2d921731-7cab-42a7-a32a-913a61728e9a"}],"id":"a807ba99-9585-4bb5-8a52-6f2e3766bd1f","sectionId":"7f1e6c3c-220d-4b6f-9756-baf328e6798b","dateType":"basic","options1":[],"dataColumns":[]},{"required":false,"description":"","value":null,"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"numberField","label":"Number","icon":"octicon:number-16","inputLabel":"Quantity","inputType":"number","inputMode":"decimal","id":"2320bfc3-1515-4c5b-806a-1c4b10304846","sectionId":"7f1e6c3c-220d-4b6f-9756-baf328e6798b","dateType":"basic","selectType":"list","options1":[],"options":[],"dataColumns":[]},{"required":false,"description":"","value":null,"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"selectField","label":"List","icon":"tabler:select","inputLabel":"Unit","inputType":"select","selectType":"list","options":[{"label":"Kg","value":"kg","id":"2d921731-7cab-42a7-a32a-913a61728e9a"},{"label":"g","value":"g","id":"5de36ef4-c25f-4970-b4d8-8dbefb5f3675"}],"id":"fd208b91-d289-47fd-a1fd-b9dbeab09aa3","sectionId":"7f1e6c3c-220d-4b6f-9756-baf328e6798b","dateType":"basic","options1":[],"dataColumns":[]},{"required":false,"description":"","value":null,"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"selectField","label":"List","icon":"tabler:select","inputLabel":"Order PickUp","inputType":"select","selectType":"list","options":[{"label":"True","value":"true","id":"2d921731-7cab-42a7-a32a-913a61728e9a"},{"label":"False","value":"false","id":"5a47e98e-50d0-4afd-936b-2d64d988972f"}],"id":"88f038e8-68a8-4c94-bb15-45d7a670d5be","sectionId":"7f1e6c3c-220d-4b6f-9756-baf328e6798b","dateType":"basic","options1":[],"dataColumns":[]}],"disabled":false,"isHidden":false}]
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
