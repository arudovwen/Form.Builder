interface DataColumnType {
    field: string;
    headerName: string;
    width?: number;
    editable?: boolean;
}
export interface ElementType {
    type: string;
    label: string;
    childLabel?: string;
    icon: string;
    inputLabel: string;
    required?: boolean;
    inputType: string;
    maxLength?: number | null;
    minLength?: number | null;
    placeholder?: string;
    description?: string;
    isReadOnly?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    requiredMessage?: string;
    minLengthMessage?: string;
    maxLengthMessage?: string;
    value?: any;
    options?: Array<{
        label: string;
        value: any;
        id: string;
        key?: string;
    }>;
    columns?: number;
    gridId?: string;
    gridPosition?: Record<string, any>;
    maxAmount?: number | null;
    minAmount?: number | null;
    minAmountMessage?: string;
    maxAmountMessage?: string;
    prefix?: string | null;
    sectionId?: string;
    url?: string;
    method?: string;
    denominators?: null;
    responseType?: string;
    headerClass?: string;
    customClass?: string | null;
    elementClass?: string;
    dataColumns?: DataColumnType[];
    options2?: Array<{
        label: string;
        value: any;
        id: string;
        key?: string;
    }>;
    inputMode?: string;
    pattern?: string;
    selectType?: string;
    dateType?: string;
    dateFormat?: string;
}
export declare const Elements: ElementType[];
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
export declare const dateFormats: {
    label: string;
    value: string;
}[];
export {};
