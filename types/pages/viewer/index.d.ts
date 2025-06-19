import { ReactNode } from "react";
export interface RenderProps {
    onSubmit?: (e: any) => void;
    answerData?: any;
    isReadOnly?: boolean;
    form_data?: any;
    ignoreValidation?: boolean;
    loading?: boolean;
    config?: any;
    renderType?: "multi" | "single";
    children?: ReactNode;
}
export default function Viewer({ answerData, form_data, ignoreValidation, onSubmit, isReadOnly, loading, config, renderType, children, }: RenderProps): import("react/jsx-runtime").JSX.Element;
