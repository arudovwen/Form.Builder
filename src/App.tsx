import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
    {
        "id": "3be536cd-1782-4852-881f-b31f7c329301",
        "value": "First",
        "sectionId": "d5f63173-8852-4bef-bb9d-e59c3182c684",
        "type": "textField",
        "metaData": {}
    },
    {
        "id": "ee6b2742-c5b3-4ad5-971a-89b15b5b1f8b",
        "value": "",
        "sectionId": "d5f63173-8852-4bef-bb9d-e59c3182c684",
        "type": "textField",
        "metaData": {}
    },
    {
        "id": "4964a981-dfb6-4e09-aba1-b3137cb1865d",
        "value": [
            {
                "label": "Placeholder 1",
                "value": "placeholder_1",
                "id": "3f1ff3b4-7178-47c3-bd38-3af4a3c17996"
            },
            {
                "label": "Placeholder 2",
                "value": "placeholder_2",
                "id": "1373b9a2-004a-4791-a734-9ed90183d825"
            }
        ],
        "sectionId": "d5f63173-8852-4bef-bb9d-e59c3182c684",
        "type": "multiSelect",
        "metaData": {}
    },
    {
        "id": "8cfe5971-6d67-441a-b24a-69f6f5bea40b",
        "value": "Yes",
        "sectionId": "6390b2f2-2938-4165-bbc2-cbebd3798851",
        "type": "textField",
        "metaData": {}
    },
    {
        "id": "6d3e7f9a-d1e8-42c1-bfb5-7c5226bb9ade",
        "value": "Okay",
        "sectionId": "6390b2f2-2938-4165-bbc2-cbebd3798851",
        "type": "textField",
        "metaData": {}
    }
]

const questionDa = [
    {
        "title": "First Section",
        "description": "",
        "id": "d5f63173-8852-4bef-bb9d-e59c3182c684",
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
                "type": "textField",
                "label": "Text Input",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "3be536cd-1782-4852-881f-b31f7c329301",
                "sectionId": "d5f63173-8852-4bef-bb9d-e59c3182c684"
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
                "type": "textField",
                "label": "Text Input",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "ee6b2742-c5b3-4ad5-971a-89b15b5b1f8b",
                "sectionId": "d5f63173-8852-4bef-bb9d-e59c3182c684"
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
                "type": "multiSelect",
                "label": "Multi List",
                "icon": "fluent-mdl2:multi-select",
                "inputLabel": "Select Text Label",
                "inputType": "select",
                "options": [
                    {
                        "label": "Placeholder 1",
                        "value": "placeholder_1",
                        "id": "3f1ff3b4-7178-47c3-bd38-3af4a3c17996"
                    },
                    {
                        "label": "Placeholder 2",
                        "value": "placeholder_2",
                        "id": "1373b9a2-004a-4791-a734-9ed90183d825"
                    },
                    {
                        "label": "Placeholder 3",
                        "value": "placeholder_3",
                        "id": "45f939d8-0528-4954-9a5c-0fd61c9e62f3"
                    }
                ],
                "id": "4964a981-dfb6-4e09-aba1-b3137cb1865d",
                "sectionId": "d5f63173-8852-4bef-bb9d-e59c3182c684",
                "dateType": "basic",
                "selectType": "list",
                "options1": [],
                "dataColumns": []
            }
        ],
        "disabled": false,
        "isHidden": false
    },
    {
        "title": "Hidden Section",
        "description": "",
        "id": "46f32edf-99f3-41ad-866f-b5f791a39c71",
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
                "type": "textField",
                "label": "Text Input",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "9932b98b-cb2d-4405-9d7c-1078a50d5ec5",
                "sectionId": "46f32edf-99f3-41ad-866f-b5f791a39c71"
            }
        ],
        "disabled": false,
        "isHidden": true
    },
    {
        "title": "Last Section",
        "description": "",
        "id": "6390b2f2-2938-4165-bbc2-cbebd3798851",
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
                "type": "textField",
                "label": "Text Input",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "8cfe5971-6d67-441a-b24a-69f6f5bea40b",
                "sectionId": "6390b2f2-2938-4165-bbc2-cbebd3798851"
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
                "type": "textField",
                "label": "Text Input",
                "icon": "fluent:text-16-filled",
                "inputLabel": "Text Label",
                "inputType": "text",
                "id": "6d3e7f9a-d1e8-42c1-bfb5-7c5226bb9ade",
                "sectionId": "6390b2f2-2938-4165-bbc2-cbebd3798851"
            }
        ],
        "disabled": false,
        "isHidden": false
    }
]


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
                questionData={questionDa}
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
