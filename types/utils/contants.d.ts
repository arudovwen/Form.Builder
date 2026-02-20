export declare enum ElementKind {
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
    LINK = "link",
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
    GRID = "grid"
}
export interface DataColumnType {
    field: string;
    headerName: string;
    width?: number;
    editable?: boolean;
    type?: string;
    validate?: boolean;
    id: string;
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
    isMultiple: boolean;
    acceptedFiles: any[];
    showState?: boolean;
}
export declare const countryOptions: OptionType[];
export declare const Elements: ElementType[];
export declare const CategorizedElements: Readonly<{
    textFields: ElementKind[];
    selectionFields: ElementKind[];
    dateAndTime: ElementKind[];
    fileAndMedia: ElementKind[];
    layoutAndDisplay: ElementKind[];
    advancedData: ElementKind[];
}>;
export declare const dateFormats: {
    label: string;
    value: string;
}[];
export declare const AllowValidationPrefix: string[];
export declare const AllowValidationMaxMin: string[];
export declare const AllowValidationPlaceholder: string[];
export declare const AllowValidationAmount: string[];
export declare const noAllowValidation: string[];
export declare const AllowOptions: string[];
export declare const AllowApiOptions: string[];
export declare const AllowTableOptions: string[];
export declare const AllowTextOptions: string[];
export declare const noAllowEdit: string[];
export declare const allowValue: string[];
export declare const FileTypes: {
    value: string;
    label: string;
}[];
