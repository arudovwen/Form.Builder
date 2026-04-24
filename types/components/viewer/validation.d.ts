import * as yup from "yup";
interface QuestionData {
    id: string;
    type: "textField" | "longText" | "numberField" | "amountField" | "selectField" | "checkbox" | "email" | "date" | "matrix" | "url";
    isRequired?: boolean;
    requiredMessage?: string;
    minLength?: number;
    maxLength?: number;
    minAmount?: number;
    maxAmount?: number;
    minLengthMessage?: string;
    maxLengthMessage?: string;
    minAmountMessage?: string;
    maxAmountMessage?: string;
    isDisabled?: boolean;
}
interface Section {
    questionData: QuestionData[];
}
export declare function generateDynamicSchema({ formData, isReadOnly }: {
    formData: Section[];
    isReadOnly: boolean;
}): yup.ObjectSchema<{
    [x: string]: any;
}, yup.AnyObject, {
    [x: string]: any;
}, "">;
export {};
