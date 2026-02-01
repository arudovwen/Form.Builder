import React, { ReactNode } from "react";
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
    onGetValues?: (data: any[]) => void;
    isReadOnly?: boolean;
    renderType?: RenderType;
    children?: ReactNode;
    hideFooter?: boolean;
    uploadUrl?: string;
}
declare const _default: React.NamedExoticComponent<FormRendererProps>;
export default _default;
