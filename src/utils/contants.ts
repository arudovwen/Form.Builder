import countries from "../data/countries.json";

/* ---------------------------------- */
/* Enums & Types */
/* ---------------------------------- */

export enum ElementKind {
  BASIC_TEXT = "basicText",
  TEXT = "textField",
  LONG_TEXT = "longText",
  SELECT = "selectField",
  CASCADE_SELECT = "cascadeSelect",
  MULTI_SELECT = "multiSelect",
  VALIDATE_INPUT = "validateInput",
  NUMBER = "numberField",
  AMOUNT = "amountField",
  DATE = "date",
  PASSWORD = "password",
  CHECKBOX = "checkbox",
  PHONE = "phoneField",
  RADIO = "radio",
  EMAIL = "email",
  FILE = "file",
  COUNTRY = "country",
  RATING = "rating",
  DATA_GRID = "dataGrid",
  TABLE_INPUT = "tableInput",
  DIVIDER = "divider",
  SPACER = "spacer",
  SECTION = "section",
  GRID = "grid",
}

export interface DataColumnType {
  field: string;
  headerName: string;
  width?: number;
  editable?: boolean;
}

export interface OptionType {
  label: string;
  value: any;
  id: string;
  key?: string;
}

export interface ElementType {
  type: ElementKind;
  label: string;
  icon: string;
  inputLabel: string;
  inputType: string;

  required?: boolean;
  placeholder?: string;
  description?: string;
  value?: any;

  maxLength?: number | null;
  minLength?: number | null;
  maxAmount?: number | null;
  minAmount?: number | null;

  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;

  requiredMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  minAmountMessage?: string;
  maxAmountMessage?: string;

  options?: OptionType[];
  options2?: OptionType[];

  columns?: number;
  dataColumns?: DataColumnType[];

  prefix?: string | null;
  inputMode?: string;
  pattern?: string;

  selectType?: string;
  dateType?: string;
  dateFormat?: string;
  minDate?: string | null;
  maxDate?: string | null;
  canHaveDateRange?: boolean;
  allowYearPicker?: boolean;

  url?: string;
  method?: string;
  responseType?: string;

  customClass?: string | null;
  elementClass?: string;
  gridPosition?: any;
  gridId?: string | null;

  isHidden: boolean;
  visibilityDependentFields?: string;
  visibilityDependentFieldsValue?: any;

  isMultiple: boolean
  acceptedFiles: any[]
}

/* ---------------------------------- */
/* Shared Defaults */
/* ---------------------------------- */

const baseElement = {
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
};

const textDefaults = {
  ...baseElement,
  maxLength: null,
  minLength: null,
  placeholder: "Type here",
  requiredMessage: "Field is required",
  minLengthMessage: "",
  maxLengthMessage: "",
};

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

const option = (label: string, value = label): OptionType => ({
  label,
  value,
  id: value,
});

const createElement = (config: Partial<ElementType>): ElementType =>
  ({
    ...textDefaults,
    ...config,
  } as ElementType);

/* ---------------------------------- */
/* Static Options */
/* ---------------------------------- */

export const countryOptions: OptionType[] = countries.map((c: any) => ({
  label: c.name,
  value: c.name,
  id: c.code || c.name,
}));

/* ---------------------------------- */
/* Elements */
/* ---------------------------------- */

export const Elements: ElementType[] = [
  createElement({
    type: ElementKind.BASIC_TEXT,
    label: "Basic Text",
    icon: "fluent:text-16-filled",
    inputLabel: "",
    inputType: "basicText",
  }),

  createElement({
    type: ElementKind.TEXT,
    label: "Text Field",
    icon: "fluent:text-16-filled",
    inputLabel: "Text Label",
    inputType: "text",
  }),

  createElement({
    type: ElementKind.LONG_TEXT,
    label: "Long Text Field",
    icon: "dashicons:text",
    inputLabel: "Long Text Label",
    inputType: "text",
  }),

  createElement({
    type: ElementKind.SELECT,
    label: "Select List",
    icon: "tabler:select",
    inputLabel: "Select Text Label",
    inputType: "select",
    selectType: "list",
    options: [option("Placeholder 1", "")],
  }),

  createElement({
    type: ElementKind.CASCADE_SELECT,
    label: "Cascade Select",
    icon: "tabler:select",
    inputLabel: "Select Text Label",
    inputType: "select",
    options: [option("Parent", "")],
    options2: [option("Child", "")],
  }),

  createElement({
    type: ElementKind.MULTI_SELECT,
    label: "Multi Select",
    icon: "fluent-mdl2:multi-select",
    inputLabel: "Select Text Label",
    inputType: "select",
    options: [option("Placeholder 1", "")],
  }),

  createElement({
    type: ElementKind.VALIDATE_INPUT,
    label: "Validate Input",
    icon: "iconoir:www",
    inputLabel: "Validate Input Label",
    inputType: "validateInput",
    url: "https://api.example.com/validate?value={value}",
    method: "GET",
    responseType: "string",
  }),

  createElement({
    type: ElementKind.NUMBER,
    label: "Number",
    icon: "octicon:number-16",
    inputLabel: "Number Label",
    inputType: "number",
    inputMode: "decimal",
  }),

  createElement({
    type: ElementKind.AMOUNT,
    label: "Amount",
    icon: "carbon:currency",
    inputLabel: "Enter amount",
    inputType: "amount",
    prefix: null,
  }),

  createElement({
    type: ElementKind.DATE,
    label: "Date",
    icon: "bx:calendar",
    inputLabel: "Date Label",
    inputType: "date",
    dateType: "custom",
    dateFormat: "dd/MM/yyyy",
    minDate: null,
    maxDate: null,
    canHaveDateRange: false,
    allowYearPicker: false,
  }),

  createElement({
    type: ElementKind.PASSWORD,
    label: "Password",
    icon: "ic:round-password",
    inputLabel: "Password Label",
    inputType: "password",
  }),

  createElement({
    type: ElementKind.CHECKBOX,
    label: "Checkbox",
    icon: "mingcute:checkbox-line",
    inputLabel: "Checkbox Label",
    inputType: "checkbox",
    options: [option("Checkbox Option", "")],
  }),

  createElement({
    type: ElementKind.PHONE,
    label: "Phone Number",
    icon: "fluent-mdl2:add-phone",
    inputLabel: "Phone Label",
    inputType: "tel",
    pattern: "^\\+?[0-9]{7,15}$",
  }),

  createElement({
    type: ElementKind.RADIO,
    label: "Radio Select",
    icon: "ri:checkbox-circle-line",
    inputLabel: "Radio Label",
    inputType: "radio",
    options: [option("Radio Option", "")],
  }),

  createElement({
    type: ElementKind.EMAIL,
    label: "Email",
    icon: "mdi:email-outline",
    inputLabel: "Email Label",
    inputType: "email",
  }),

  createElement({
    type: ElementKind.FILE,
    label: "File Attachment",
    icon: "ion:attach-sharp",
    inputLabel: "File Label",
    inputType: "file",
    isMultiple: false,
    acceptedFiles: []
  }),

  createElement({
    type: ElementKind.COUNTRY,
    label: "Country",
    icon: "fluent:globe-16-regular",
    inputLabel: "Select Country",
    inputType: "country",
    options: countryOptions,
  }),

  createElement({
    type: ElementKind.RATING,
    label: "Ratings",
    icon: "streamline-ultimate:rating-star-ribbon",
    inputLabel: "Rating Label",
    inputType: "rating",
  }),

  createElement({
    type: ElementKind.DATA_GRID,
    label: "Data Grid",
    icon: "carbon:data-table",
    inputLabel: "Data Grid Label",
    inputType: "dataGrid",
    value: [],
    dataColumns: [
      {
        field: "firstName",
        headerName: "First Name",
        width: 150,
        editable: true,
      },
    ],
  }),

  createElement({
    type: ElementKind.TABLE_INPUT,
    label: "Table Input",
    icon: "iconoir:table",
    inputLabel: "Table Input Label",
    inputType: "tableInput",
    value: [],
  }),

  createElement({
    type: ElementKind.DIVIDER,
    label: "Divider",
    icon: "pixel:divider",
    inputLabel: "",
    inputType: "divider",
  }),

  createElement({
    type: ElementKind.SPACER,
    label: "Spacer",
    icon: "fluent-mdl2:spacer",
    inputLabel: "",
    inputType: "spacer",
  }),

  createElement({
    type: ElementKind.SECTION,
    label: "Section",
    icon: "stash:section-divider",
    inputLabel: "",
    inputType: "section",
  }),

  createElement({
    type: ElementKind.GRID,
    label: "Grid",
    icon: "cuida:grid-outline",
    inputLabel: "",
    inputType: "grid",
    columns: 2,
  }),
];

/* ---------------------------------- */
/* Categorization */
/* ---------------------------------- */

export const CategorizedElements = Object.freeze({
  textFields: [
    ElementKind.BASIC_TEXT,
    ElementKind.TEXT,
    ElementKind.LONG_TEXT,
    ElementKind.NUMBER,
    ElementKind.AMOUNT,
    ElementKind.PASSWORD,
    ElementKind.PHONE,
    ElementKind.EMAIL,
    ElementKind.VALIDATE_INPUT,
  ],
  selectionFields: [
    ElementKind.SELECT,
    ElementKind.MULTI_SELECT,
    ElementKind.CASCADE_SELECT,
    ElementKind.RADIO,
    ElementKind.CHECKBOX,
    ElementKind.COUNTRY,
    ElementKind.RATING,
  ],
  dateAndTime: [ElementKind.DATE],
  fileAndMedia: [ElementKind.FILE],
  layoutAndDisplay: [
    ElementKind.DIVIDER,
    ElementKind.SPACER,
    ElementKind.GRID,
    ElementKind.SECTION,
  ],
  advancedData: [ElementKind.DATA_GRID, ElementKind.TABLE_INPUT],
});

/* ---------------------------------- */
/* Date Formats */
/* ---------------------------------- */

export const dateFormats = Object.freeze([
  { label: "Day/Month/Year", value: "dd/MM/yyyy" },
  { label: "Month/Day/Year", value: "MM/dd/yyyy" },
  { label: "ISO (Year-Month-Day)", value: "yyyy-MM-dd" },
  { label: "Full Month Day, Year", value: "MMMM d, yyyy" },
  { label: "Abbreviated Month Day, Year", value: "MMM d, yyyy" },
  { label: "Day. Month. Year", value: "dd.MM.yyyy" },
  { label: "Day Month Name Year", value: "dd MMMM yyyy" },
  { label: "Weekday, Month Day, Year", value: "EEEE, MMMM d, yyyy" },
  { label: "Short Weekday, Month Day, Year", value: "EEE, MMM d, yyyy" },
  { label: "Day-Month-Year", value: "dd-MM-yyyy" },
]);

export const AllowValidationPrefix: string[] = ["amount"];
export const AllowValidationMaxMin: string[] = ["text", "number"];
export const AllowValidationPlaceholder: string[] = [
  "text",
  "number",
  "amount",
  "date",
  "password",
];
export const AllowValidationAmount: string[] = ["amount"];
export const noAllowValidation: string[] = [
  "grid",
  "section",
  "divider",
  "spacer",
  "basicText",
];
export const AllowOptions: string[] = [
  "radio",
  "select",
  "checkbox",
  "multiselect",
];
export const AllowApiOptions: string[] = ["validateInput"];
export const AllowTableOptions: string[] = ["tableInput"];
export const AllowTextOptions: string[] = ["text"];
export const noAllowEdit: string[] = ["divider", "spacer"];
export const allowValue: string[] = ["basicText"];


export const FileTypes = [
  {
    value: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/heic",
    ].join(", "),
    label: "Image",
  },
  {
    value: "application/pdf",
    label: "PDF",
  },
  {
    value: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ].join(", "),
    label: "Word",
  },
  {
    value: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].join(", "),
    label: "Spreadsheet",
  },
  {
    value: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ].join(", "),
    label: "PowerPoint",
  },
  {
    value: ["video/mp4", "video/x-m4v", "video/*"].join(", "),
    label: "Videos",
  },
];
