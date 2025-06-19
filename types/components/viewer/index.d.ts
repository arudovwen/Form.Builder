import { ReactNode } from "react";
export interface AnswerElement {
    id: string;
    value: any;
    [key: string]: any;
}
export type RenderType = "multi" | "single";
export interface FormRendererProps {
    form_data: any[];
    answerData?: any[];
    ignoreValidation?: boolean;
    onSubmitData?: (data: any[]) => void;
    isReadOnly?: boolean;
    renderType?: RenderType;
    children?: ReactNode;
}
declare const FormRenderer: ({ form_data, answerData, ignoreValidation, onSubmitData, isReadOnly, renderType, children, }: any) => import("react/jsx-runtime").JSX.Element;
export default FormRenderer;
