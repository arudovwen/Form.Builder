export const Elements = [
  {
    type: "textField",
    label: "Short Text",
    icon: "fluent:text-16-filled",
    inputLabel: "Short Text Label",
    required: false,
    inputType: "text",
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
  },
  {
    type: "longText",
    label: "Long Text",
    icon: "dashicons:text",
    inputLabel: "Long Text Label",
    required: false,
    inputType: "text",
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
  },
  {
    type: "selectField",
    label: "Select List",
    icon: "tabler:select",
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
  },
  {
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
  },
  {
    type: "numberField",
    label: "Number",
    icon: "octicon:number-16",
    inputLabel: "Number Label",
    required: false,
    inputType: "number",
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
  },
  {
    type: "amountField",
    label: "Amount",
    icon: "carbon:currency",
    inputLabel: "Enter amount",
    required: false,
    inputType: "amount",
    maxAmount: null,
    minAmount: null,
    placeholder: "Type here",
    description: "",
    isReadOnly: false,
    isDisabled: false,
    isRequired: false,
    requiredMessage: "Field is required",
    minAmountMessage: "",
    maxAmountMessage: "",
    value: null,
  },
  {
    type: "date",
    label: "Date",
    icon: "bx:calendar",
    inputLabel: "Date Text Label",
    required: false,
    inputType: "date",
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
  },
  {
    type: "password",
    label: "Password",
    icon: "ic:round-password",
    inputLabel: "Password Text Label",
    required: false,
    inputType: "password",
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
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: "mingcute:checkbox-line",
    inputLabel: "Checkbox Text Label",
    required: false,
    inputType: "checkbox",
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
  },
  {
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
  },
  {
    type: "email",
    label: "Email",
    icon: "mdi:email-outline",
    inputLabel: "Email Text Label",
    required: false,
    inputType: "email",
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
  },
  {
    type: "file",
    label: "File Attachment",
    icon: "ion:attach-sharp",
    inputLabel: "File Text Label",
    required: false,
    inputType: "file",
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
  },
  {
    type: "grid",
    label: "Grid",
    icon: "cuida:grid-outline",
    inputLabel: "Grid Text Label",
    inputType: "grid",
    placeholder: "Type here",
    description: "",
    grid: 2,
    gridData: [],
  },
];

export const AllowValidationMaxMin = ["text", "number"];
export const AllowValidationPlaceholder = [
  "text",
  "number",
  "amount",
  "date",
  "password",
];
export const AllowValidationAmount = ["amount"];

export const noAllowValidation = ["grid", "section"];
