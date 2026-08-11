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
const questionDa = [
  {
    title: "",
    description: "",
    id: "d56a49df-07fd-430b-8209-25cdfecb45c1",
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
        type: "ranking",
        label: "Ranking Poll",
        icon: "fluent:re-order-16-regular",
        inputLabel: "Ranking Label",
        inputType: "ranking",
        options: [
          {
            label: "Option 1",
            value: "option_1",
            id: "202b100a-312f-4be4-9da3-4822f77e3afd",
          },
          {
            label: "Option 2",
            value: "option_2",
            id: "46dd9576-650d-40ea-aa7d-9b209713fdd5",
          },
        ],
        id: "fc8ff276-499b-4f7d-90ca-c6075243608b",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
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
        type: "matrix",
        label: "Likert Scale",
        icon: "pepicons-pop:list",
        inputLabel: "Matrix Label",
        inputType: "matrix",
        options: [
          {
            id: "r1",
            label: "Example Row",
            value: "row_1",
          },
        ],
        options1: [
          {
            id: "c1",
            label: "Strongly Disagree",
            value: "strongly_disagree",
          },
          {
            id: "c2",
            label: "Disagree",
            value: "disagree",
          },
          {
            id: "c3",
            label: "Neutral",
            value: "neutral",
          },
          {
            id: "c4",
            label: "Agree",
            value: "agree",
          },
          {
            id: "c5",
            label: "Strongly Agree",
            value: "strongly_agree",
          },
        ],
        id: "da37d391-9658-4551-be53-2425bd5b442e",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
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
        type: "rating",
        label: "Ratings",
        icon: "streamline-ultimate:rating-star-ribbon",
        inputLabel: "Rating Label",
        inputType: "rating",
        id: "d31e3cc0-cca7-417c-9520-e1d81870eea1",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        type: "checkbox",
        label: "Checkbox",
        icon: "carbon:checkbox-checked",
        inputLabel: "Checkbox Label",
        inputType: "checkbox",
        options: [
          {
            id: "29c9eac0-37d7-4c79-93e4-40f057b9f8b3",
            label: "Checkbox Option",
            value: "option",
          },
        ],
        id: "4e6f5f0c-ee8d-4934-82bb-a8d86335d516",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        type: "radio",
        label: "Radio",
        icon: "mdi:radiobox-marked",
        inputLabel: "Radio Label",
        inputType: "radio",
        options: [
          {
            id: "65feb136-c254-4f82-b324-3353769e9cbf",
            label: "Radio Option",
            value: "",
          },
        ],
        id: "e7b4d2a2-19ba-412d-a00f-0dddbed6992a",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        type: "polling",
        label: "Poll",
        icon: "bx:poll",
        inputLabel: "Poll Label",
        inputType: "polling",
        options: [
          {
            id: "136f1796-190b-43eb-be17-c62ed0c21f22",
            label: "Option 1",
            value: "option_1",
          },
          {
            id: "4f1b5cc9-6ce0-44cf-8aa4-696aef2bc521",
            label: "Option 2",
            value: "option_2",
          },
        ],
        id: "6d8a9e3b-34ef-4525-b71b-12d1ee1fef17",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        type: "nps",
        label: "NPS",
        icon: "carbon:chart-evaluation",
        inputLabel: "NPS Label",
        inputType: "nps",
        id: "ecc1fb86-60ce-4cb8-ae0e-3a601e80efe6",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        type: "imageChoice",
        label: "Image Choice",
        icon: "lucide:image",
        inputLabel: "Image Choice Label",
        inputType: "imageChoice",
        options: [
          {
            id: "1dd94341-4a15-47bf-9c9d-797e1413126a",
            label: "Image 1",
            value: "image_1",
          },
          {
            id: "ad38ae7d-e294-482b-b5c7-23a3ca7cc627",
            label: "Image 2",
            value: "image_2",
          },
        ],
        id: "1e650963-b06a-4eef-990b-0a3926bf360c",
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
      },
    ],
    disabled: false,
    isHidden: false,
  },
];

const pollApiResponse = {
  succeeded: true,
  message: "Poll results retrieved successfully.",
  errors: null,
  data: {
    formId: "019ff129-2f48-751c-88da-a847dbbbaeb9",
    formName: "testagain",
    category: "poll",
    totalSubmissions: 21,
    submissionsData: [
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "fc8ff276-499b-4f7d-90ca-c6075243608b",
        type: "ranking",
        label: "Ranking Label",
        totalResponses: 6,
        responsesData: {
          rankings: [
            {
              label:
                '[{"label":"Option 2","value":"option_2","id":"46dd9576-650d-40ea-aa7d-9b209713fdd5"},{"label":"Option 1","value":"option_1","id":"202b100a-312f-4be4-9da3-4822f77e3afd"}]',
              value:
                '[{"label":"Option 2","value":"option_2","id":"46dd9576-650d-40ea-aa7d-9b209713fdd5"},{"label":"Option 1","value":"option_1","id":"202b100a-312f-4be4-9da3-4822f77e3afd"}]',
              count: 6,
              percentage: 100,
              averageRank: 1,
              positions: [
                {
                  position: 1,
                  count: 6,
                  percentage: 100,
                },
              ],
            },
            {
              optionId: "202b100a-312f-4be4-9da3-4822f77e3afd",
              label: "Option 1",
              value: "option_1",
              count: 0,
              percentage: 0,
              averageRank: null,
              positions: [],
            },
            {
              optionId: "46dd9576-650d-40ea-aa7d-9b209713fdd5",
              label: "Option 2",
              value: "option_2",
              count: 0,
              percentage: 0,
              averageRank: null,
              positions: [],
            },
          ],
        },
      },
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "da37d391-9658-4551-be53-2425bd5b442e",
        type: "matrix",
        label: "Matrix Label",
        totalResponses: 0,
        responsesData: {
          rows: [
            {
              rowId: "r1",
              label: "Example Row",
              value: "row_1",
              totalResponses: 0,
              columns: [
                {
                  optionId: "c1",
                  label: "Strongly Disagree",
                  value: "strongly_disagree",
                  count: 0,
                  percentage: 0,
                },
                {
                  optionId: "c2",
                  label: "Disagree",
                  value: "disagree",
                  count: 0,
                  percentage: 0,
                },
                {
                  optionId: "c3",
                  label: "Neutral",
                  value: "neutral",
                  count: 0,
                  percentage: 0,
                },
                {
                  optionId: "c4",
                  label: "Agree",
                  value: "agree",
                  count: 0,
                  percentage: 0,
                },
                {
                  optionId: "c5",
                  label: "Strongly Agree",
                  value: "strongly_agree",
                  count: 0,
                  percentage: 0,
                },
              ],
            },
          ],
        },
      },
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "d31e3cc0-cca7-417c-9520-e1d81870eea1",
        type: "rating",
        label: "Rating Label",
        totalResponses: 9,
        responsesData: {
          options: [
            {
              label: "3",
              value: "3",
              count: 6,
              percentage: 66.67,
            },
            {
              label: "4",
              value: "4",
              count: 3,
              percentage: 33.33,
            },
          ],
          average: 3.33,
        },
      },
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "4e6f5f0c-ee8d-4934-82bb-a8d86335d516",
        type: "checkbox",
        label: "Checkbox Label",
        totalResponses: 0,
        responsesData: {
          options: [
            {
              optionId: "29c9eac0-37d7-4c79-93e4-40f057b9f8b3",
              label: "Checkbox Option",
              value: "option",
              count: 0,
              percentage: 0,
            },
          ],
        },
      },
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "e7b4d2a2-19ba-412d-a00f-0dddbed6992a",
        type: "radio",
        label: "Radio Label",
        totalResponses: 0,
        responsesData: {
          options: [
            {
              optionId: "65feb136-c254-4f82-b324-3353769e9cbf",
              label: "Radio Option",
              value: "",
              count: 0,
              percentage: 0,
            },
          ],
        },
      },
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "6d8a9e3b-34ef-4525-b71b-12d1ee1fef17",
        type: "polling",
        label: "Poll Label",
        totalResponses: 7,
        responsesData: {
          options: [
            {
              optionId: "136f1796-190b-43eb-be17-c62ed0c21f22",
              label: "Option 1",
              value: "option_1",
              count: 5,
              percentage: 71.43,
            },
            {
              optionId: "4f1b5cc9-6ce0-44cf-8aa4-696aef2bc521",
              label: "Option 2",
              value: "option_2",
              count: 2,
              percentage: 28.57,
            },
          ],
        },
      },
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "ecc1fb86-60ce-4cb8-ae0e-3a601e80efe6",
        type: "nps",
        label: "NPS Label",
        totalResponses: 7,
        responsesData: {
          options: [
            { label: "0", value: "0", count: 0, percentage: 0 },
            { label: "1", value: "1", count: 0, percentage: 0 },
            { label: "2", value: "2", count: 0, percentage: 0 },
            { label: "3", value: "3", count: 0, percentage: 0 },
            { label: "4", value: "4", count: 4, percentage: 57.14 },
            { label: "5", value: "5", count: 2, percentage: 28.57 },
            { label: "6", value: "6", count: 0, percentage: 0 },
            { label: "7", value: "7", count: 0, percentage: 0 },
            { label: "8", value: "8", count: 0, percentage: 0 },
            { label: "9", value: "9", count: 1, percentage: 14.29 },
            { label: "10", value: "10", count: 0, percentage: 0 },
          ],
          average: 5,
          nps: {
            promoters: 1,
            passives: 0,
            detractors: 6,
            score: -71.43,
          },
        },
      },
      {
        sectionId: "d56a49df-07fd-430b-8209-25cdfecb45c1",
        fieldId: "1e650963-b06a-4eef-990b-0a3926bf360c",
        type: "imageChoice",
        label: "Image Choice Label",
        totalResponses: 7,
        responsesData: {
          options: [
            {
              optionId: "1dd94341-4a15-47bf-9c9d-797e1413126a",
              label: "Image 1",
              value: "image_1",
              count: 2,
              percentage: 28.57,
            },
            {
              optionId: "ad38ae7d-e294-482b-b5c7-23a3ca7cc627",
              label: "Image 2",
              value: "image_2",
              count: 5,
              percentage: 71.43,
            },
          ],
        },
      },
    ],
  },
};
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
