import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
    {
        "id": "9e9cd9c1-7c8c-43a4-bd04-618dc129d33d",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "date",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "fa702049-5605-4d77-ab99-3754f6e9b22e",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "textField",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "2b03b65f-134d-4ec9-a53f-6ab38f2b5227",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "textField",
        "value": "09096455019",
        "files": null,
        "metaData": {}
    },
    {
        "id": "9ce0d048-91d7-4add-ac8c-69109a8644cf",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "email",
        "value": "sodlak007@yopmail.com",
        "files": null,
        "metaData": {}
    },
    {
        "id": "0c915996-8bf4-4afc-8e00-02a3816c3a12",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "email",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "6356c09e-4b0e-4a40-ad4f-421d01daf84e",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "multiSelect",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "3b7d03a6-156d-4a25-844c-2db3305d34c9",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "multiSelect",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "31c24da0-d71d-437c-8440-2e748e96035f",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "numberField",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "486e61f1-e593-402e-80e1-13b38847add5",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "checkbox",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "ccbe14dc-eb69-4c30-8de0-932ec5337a11",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "textField",
        "value": "",
        "files": null,
        "metaData": {}
    },
    {
        "id": "175f2b21-51f5-4953-8ca7-31804b4a9074",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "textField",
        "value": "John",
        "files": null,
        "metaData": {}
    },
    {
        "id": "9cce6a1f-ed6c-4eaa-9cca-008287ae317f",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "textField",
        "value": "Doe",
        "files": null,
        "metaData": {}
    },
    {
        "id": "0716a199-4dee-426c-b90f-2e76740b834f",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "textField",
        "value": "Cervaspace Liomited",
        "files": null,
        "metaData": {}
    },
    {
        "id": "c0c26555-1df5-48b6-89d2-b61015a3fe0e",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "type": "textField",
        "value": "CEO",
        "files": null,
        "metaData": {}
    }
]

const questionDa = [
  {
    "title": "IMT 2026",
    "description": "",
    "id": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
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
        "type": "date",
        "label": "Date",
        "icon": "bx:calendar",
        "inputLabel": "Date",
        "inputType": "date",
        "dateType": "custom",
        "dateFormat": "dd/MM/yyyy",
        "minDate": null,
        "maxDate": null,
        "canHaveDateRange": false,
        "allowYearPicker": false,
        "id": "9e9cd9c1-7c8c-43a4-bd04-618dc129d33d",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
      },
      {
        "required": false,
        "description": "Your Name",
        "value": null,
        "isReadOnly": false,
        "isDisabled": false,
        "isRequired": true,
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
        "label": "Text Field",
        "icon": "fluent:text-16-filled",
        "inputLabel": "Staff\u0027s Name",
        "inputType": "text",
        "id": "fa702049-5605-4d77-ab99-3754f6e9b22e",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "type": "grid",
        "label": "Grid",
        "icon": "cuida:grid-outline",
        "inputLabel": "",
        "inputType": "grid",
        "columns": 2,
        "id": "881f5912-21b1-4420-a3ce-edabbb9e7f2f",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "label": "Text Field",
        "icon": "fluent:text-16-filled",
        "inputLabel": "Prospect\u0027s Phone Number",
        "inputType": "text",
        "id": "2b03b65f-134d-4ec9-a53f-6ab38f2b5227",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "type": "email",
        "label": "Email",
        "icon": "mdi:email-outline",
        "inputLabel": "Prospect\u0027s Email Address",
        "inputType": "email",
        "id": "9ce0d048-91d7-4add-ac8c-69109a8644cf",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "type": "grid",
        "label": "Grid",
        "icon": "cuida:grid-outline",
        "inputLabel": "",
        "inputType": "grid",
        "columns": 2,
        "id": "de2c1e7f-6345-45c0-977d-39d9e1b5519e",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
      },
      {
        "required": false,
        "description": "(If any)",
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
        "type": "email",
        "label": "Email",
        "icon": "mdi:email-outline",
        "inputLabel": "Company\u0027s Website",
        "inputType": "email",
        "id": "0c915996-8bf4-4afc-8e00-02a3816c3a12",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "label": "Multi Select",
        "icon": "fluent-mdl2:multi-select",
        "inputLabel": "What\u0027s the profile of this prospect?",
        "inputType": "select",
        "options": [
          { "label": "Manufacturer", "value": "MAN", "id": "" },
          {
            "label": "Local supplier/vendor",
            "value": "VEN",
            "id": "f42e92ac-1c6a-4725-9c8a-9233532231f7"
          },
          {
            "label": "International Manufacturer/Vendor",
            "value": "IMAN",
            "id": "6c628939-9225-412c-ad21-33a3197d4316"
          },
          {
            "label": "Distributor",
            "value": "DIS",
            "id": "d4c55e85-2ddc-4cf8-9c61-f5888de0968d"
          },
          {
            "label": "Just an Industry professional",
            "value": "JAIP",
            "id": "864f55e8-3d20-44aa-82e2-6080fe502c5e"
          },
          {
            "label": "Government Agency",
            "value": "GA",
            "id": "4cd5267e-e564-4fa7-94b8-efeaff5bd3f8"
          },
          {
            "label": "Agent Network Prospect",
            "value": "ANP",
            "id": "b3d8f51f-00fe-4cc8-af02-de095974cd00"
          },
          {
            "label": "Logistics Partner",
            "value": "LP",
            "id": "1f4f971c-9ba8-4786-b416-8ae773e65e48"
          }
        ],
        "id": "6356c09e-4b0e-4a40-ad4f-421d01daf84e",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "dataColumns": []
      },
      {
        "required": false,
        "description": "Include one, or more options if they apply",
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
        "label": "Multi Select",
        "icon": "fluent-mdl2:multi-select",
        "inputLabel": "Which of our solutions are they interested in?",
        "inputType": "select",
        "options": [
          {
            "label": "Marketplace (Manufacturers seeking supply)",
            "value": "MAR",
            "id": ""
          },
          {
            "label": "Polymer",
            "value": "POL",
            "id": "4c946a9e-c727-47bc-97a6-6f01081ded0a"
          },
          {
            "label": "Flux (Logistics)",
            "value": "LOG",
            "id": "5aeaaf88-a1df-44b0-924e-b7b5e1337795"
          },
          {
            "label": "Orbital (Suppliers seeking demand)",
            "value": "ORB",
            "id": "6604d7dd-9581-4b49-99e4-52e5f1bcdd14"
          }
        ],
        "id": "3b7d03a6-156d-4a25-844c-2db3305d34c9",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "dataColumns": []
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
        "type": "numberField",
        "label": "Number",
        "icon": "octicon:number-16",
        "inputLabel": "Estimated monthly volume",
        "inputType": "number",
        "inputMode": "decimal",
        "id": "31c24da0-d71d-437c-8440-2e748e96035f",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
      },
      {
        "required": false,
        "description": "Include one, or more options if they apply",
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
        "type": "checkbox",
        "label": "Checkbox",
        "icon": "mingcute:checkbox-line",
        "inputLabel": "Lead Quality",
        "inputType": "checkbox",
        "options": [
          {
            "label": "Hot (Immediate sourcing need)",
            "value": "HOT",
            "id": ""
          },
          {
            "label": "Warm (3-6 months)",
            "value": "WARM",
            "id": "329699a8-cae1-4c5e-bd0e-82fe0841a2f6"
          },
          {
            "label": "Strategic (Partnershop)",
            "value": "STRA",
            "id": "75fddc66-0d87-403d-8ff8-b68ba68461ba"
          }
        ],
        "id": "486e61f1-e593-402e-80e1-13b38847add5",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "dataColumns": []
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
        "placeholder": "Can you provide additional information about your conversation with this prospect to help the Marketing Team understand how best to engage them post-event?",
        "requiredMessage": "Field is required",
        "minLengthMessage": "",
        "maxLengthMessage": "",
        "type": "textField",
        "label": "Text Field",
        "icon": "fluent:text-16-filled",
        "inputLabel": "Additional remarks about your engagement with this prospect e.g. estimated monthly volume",
        "inputType": "text",
        "id": "ccbe14dc-eb69-4c30-8de0-932ec5337a11",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "gridPosition": { "col": 1 },
        "gridId": "881f5912-21b1-4420-a3ce-edabbb9e7f2f",
        "isHidden": false,
        "visibilityDependentFields": [],
        "maxLength": null,
        "minLength": null,
        "placeholder": "Prospect\u0027s Name",
        "requiredMessage": "Field is required",
        "minLengthMessage": "",
        "maxLengthMessage": "",
        "type": "textField",
        "label": "Text Field",
        "icon": "fluent:text-16-filled",
        "inputLabel": "First Name",
        "inputType": "text",
        "id": "175f2b21-51f5-4953-8ca7-31804b4a9074",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "gridPosition": { "col": 2 },
        "gridId": "881f5912-21b1-4420-a3ce-edabbb9e7f2f",
        "isHidden": false,
        "visibilityDependentFields": [],
        "maxLength": null,
        "minLength": null,
        "placeholder": "Prospect\u0027s Name",
        "requiredMessage": "Field is required",
        "minLengthMessage": "",
        "maxLengthMessage": "",
        "type": "textField",
        "label": "Text Field",
        "icon": "fluent:text-16-filled",
        "inputLabel": "Last Name",
        "inputType": "text",
        "id": "9cce6a1f-ed6c-4eaa-9cca-008287ae317f",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "gridPosition": { "col": 1 },
        "gridId": "de2c1e7f-6345-45c0-977d-39d9e1b5519e",
        "isHidden": false,
        "visibilityDependentFields": [],
        "maxLength": null,
        "minLength": null,
        "placeholder": "Company Name",
        "requiredMessage": "Field is required",
        "minLengthMessage": "",
        "maxLengthMessage": "",
        "type": "textField",
        "label": "Text Field",
        "icon": "fluent:text-16-filled",
        "inputLabel": "Company Name",
        "inputType": "text",
        "id": "0716a199-4dee-426c-b90f-2e76740b834f",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
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
        "gridPosition": { "col": 2 },
        "gridId": "de2c1e7f-6345-45c0-977d-39d9e1b5519e",
        "isHidden": false,
        "visibilityDependentFields": [],
        "maxLength": null,
        "minLength": null,
        "placeholder": "Prospect\u0027s role",
        "requiredMessage": "Field is required",
        "minLengthMessage": "",
        "maxLengthMessage": "",
        "type": "textField",
        "label": "Text Field",
        "icon": "fluent:text-16-filled",
        "inputLabel": "Role at Company",
        "inputType": "text",
        "id": "c0c26555-1df5-48b6-89d2-b61015a3fe0e",
        "sectionId": "3ae045d2-496c-47ae-9b6c-09bcf9b41201",
        "dateType": "basic",
        "selectType": "list",
        "options1": [],
        "options": [],
        "dataColumns": []
      }
    ]
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
              isReadOnly
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
