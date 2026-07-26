import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
  {
    id: "7da3ed35-e5ee-47f0-aae6-9f5a706ead1e",
    sectionId: "d5e635ad-189a-4503-9a58-55c601a4b873",
    type: "string",
    value: "two",
    files: null,
    metaData: {},
  },
  {
    id: "1300a62b-64e7-45aa-9e5a-9e703263e5e8",
    sectionId: "d5e635ad-189a-4503-9a58-55c601a4b873",
    type: "string",
    value: [
      {
        label: "Two",
        value: "two",
        id: "5cdd3824-e255-4265-9a14-e8556b0a74f3",
      },
      {
        label: "One",
        value: "one",
        id: "d008d296-6079-45ee-be20-ec58f91ae109",
      },
    ],
    files: null,
    metaData: {},
  },
  {
    id: "5a923fdd-49c4-490e-82fc-f84d9e2cc28a",
    sectionId: "d5e635ad-189a-4503-9a58-55c601a4b873",
    type: "string",
    value: [
      {
        base64:
          "https://dev.api.edms.thetaskforge.co/uploads/Korean Airlines-20e9a138-05e9-42f5-9ea0-7126f62a29b8/94e238ae-cdd3-4b36-908a-f7f8ea27650f.png",
        type: "image/png",
        name: "Flux Icon Main.png",
      },
    ],
    files: null,
    metaData: {},
  },
  {
    id: "0f7fe671-590a-47b7-9fdb-a056f98c99f8",
    sectionId: "d5e635ad-189a-4503-9a58-55c601a4b873",
    type: "dataGrid",
    value: {
      rows: [
        {
          name: "",
          age: "",
          country: "",
          id: "7fd1e9cc-5600-bd62-26b0-f71712f3ddac",
        },
      ],
      columns: [
        {
          id: "8c356648-ee40-406f-adb2-2403e466f304",
          field: "name",
          headerName: "Name",
          width: 160,
          editable: true,
          type: "select",
          validate: false,
        },
        {
          id: "8a6da2af-1afe-4e1d-a0aa-7804d415f96b",
          field: "age",
          headerName: "Age",
          width: 160,
          editable: true,
          type: "text",
          validate: false,
        },
        {
          id: "d229f5b0-1833-446d-ae8a-d1c88e3dfd17",
          field: "country",
          headerName: "Country",
          width: 160,
          editable: true,
          type: "text",
          validate: false,
        },
      ],
    },
    files: null,
    metaData: {},
  },
  {
    id: "a8d8a7d4-ec71-4c59-baae-9cd51413ea66",
    sectionId: "d5e635ad-189a-4503-9a58-55c601a4b873",
    type: "dataGrid",
    value: {
      rows: [
        {
          country: "",
          your_name: "",
          your_age: "",
          id: "7c7858c6-06a9-a451-9d5c-ab7a02b42e44",
        },
      ],
      columns: [
        {
          id: "8c356648-ee40-406f-adb2-2403e466f304",
          field: "country",
          headerName: "Country",
          width: 160,
          editable: true,
          type: "text",
          validate: false,
        },
        {
          id: "0d014f63-ff39-49c6-b988-fdf5645e5937",
          field: "your_name",
          headerName: "Your Name",
          width: 160,
          editable: true,
          type: "text",
          validate: false,
        },
        {
          id: "55724579-d4ba-413b-b1dd-4a0e8cbc7da1",
          field: "your_age",
          headerName: "Your Age",
          width: 160,
          editable: true,
          type: "text",
          validate: false,
        },
      ],
    },
    files: null,
    metaData: {},
  },
];

const questionDa = [{"title":"","description":"","id":"d5e635ad-189a-4503-9a58-55c601a4b873","questionData":[{"required":false,"description":"","value":[],"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"dataGrid","label":"Table","icon":"carbon:data-table","inputLabel":"Table Label","inputType":"dataGrid","dataColumns":[{"id":"8c356648-ee40-406f-adb2-2403e466f304","field":"name","headerName":"Name","width":150,"editable":true,"type":"select","validate":false,"optionsUrl":"https://dummyjson.com/c/a6bf-d50c-49a7-8eee"},{"headerName":"Age","field":"age","editable":true,"id":"8a6da2af-1afe-4e1d-a0aa-7804d415f96b","type":"text","validate":false},{"headerName":"Country","field":"country","editable":true,"id":"d229f5b0-1833-446d-ae8a-d1c88e3dfd17","type":"text","validate":false}],"id":"0f7fe671-590a-47b7-9fdb-a056f98c99f8","sectionId":"d5e635ad-189a-4503-9a58-55c601a4b873","dateType":"basic","selectType":"list","options1":[],"options":[]},{"required":false,"description":"","value":null,"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"selectField","label":"List","icon":"tabler:select","inputLabel":"Single","inputType":"select","selectType":"list","options":[{"label":"Two","value":"two","id":"13c7fdad-798f-412b-8e73-0294920b8882"},{"label":"Three","value":"three","id":"0bbc6703-ec3c-400c-b439-4b5cc36253dc"}],"id":"7da3ed35-e5ee-47f0-aae6-9f5a706ead1e","sectionId":"d5e635ad-189a-4503-9a58-55c601a4b873","dateType":"basic","options1":[],"dataColumns":[]},{"required":false,"description":"","value":null,"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"multiSelect","label":"Multi List","icon":"fluent-mdl2:multi-select","inputLabel":"Multi","inputType":"select","options":[{"label":"One","value":"one","id":"d008d296-6079-45ee-be20-ec58f91ae109"},{"label":"Two","value":"two","id":"5cdd3824-e255-4265-9a14-e8556b0a74f3"},{"label":"Three","value":"three","id":"2c32d29e-5d61-4ea1-8570-10c429601e58"}],"id":"1300a62b-64e7-45aa-9e5a-9e703263e5e8","sectionId":"d5e635ad-189a-4503-9a58-55c601a4b873","dateType":"basic","selectType":"list","options1":[],"dataColumns":[]},{"required":false,"description":"","value":null,"isReadOnly":false,"isDisabled":false,"isRequired":false,"customClass":"","elementClass":"","gridPosition":null,"gridId":null,"isHidden":false,"visibilityDependentFields":[],"maxLength":null,"minLength":null,"placeholder":"Type here","requiredMessage":"Field is required","minLengthMessage":"","maxLengthMessage":"","type":"file","label":"File","icon":"ion:attach-sharp","inputLabel":"File Label","inputType":"file","isMultiple":false,"acceptedFiles":[],"id":"5a923fdd-49c4-490e-82fc-f84d9e2cc28a","sectionId":"d5e635ad-189a-4503-9a58-55c601a4b873"}],"disabled":false,"isHidden":false}]
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
