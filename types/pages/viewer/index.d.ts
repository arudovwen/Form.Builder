import { ReactNode } from "react";
import { DeleteMode, FormSettings } from "@/context/editor-context";
export interface RenderProps {
    onSubmit?: (data: any, settings?: FormSettings) => void;
    answerData?: any;
    isReadOnly?: boolean;
    form_data?: any;
    ignoreValidation?: boolean;
    loading?: boolean;
    config?: any;
    renderType?: "multi" | "single" | "conversational";
    children?: ReactNode | ((options: {
        isUploading: boolean;
        isSubmitting: boolean;
        hasErrors: boolean;
        submitText?: string;
    }) => ReactNode);
    hideFooter?: boolean;
    onGetValues?: (e: any) => void;
    uploadUrl?: string;
    pollResults?: Record<string, any>;
    showResults?: boolean;
    hideInputsOnResults?: boolean;
    sendHiddenSectionsAsEmpty?: boolean;
    preview?: boolean;
    deleteMode?: DeleteMode;
    submitText?: string;
    title?: string;
    description?: string;
    formSettings?: FormSettings;
}
export default function Viewer({ answerData, form_data, ignoreValidation, onSubmit, isReadOnly, loading, config, renderType, children, hideFooter, onGetValues, uploadUrl, pollResults, showResults, hideInputsOnResults, sendHiddenSectionsAsEmpty, preview, deleteMode, submitText, title, description, formSettings: externalFormSettings, }: RenderProps): import("react/jsx-runtime").JSX.Element;
