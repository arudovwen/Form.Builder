import { ReactNode } from "react";
import { DeleteMode } from "@/context/editor-context";
export interface RenderProps {
    onSubmit?: (e: any) => void;
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
}
export default function Viewer({ answerData, form_data, ignoreValidation, onSubmit, isReadOnly, loading, config, renderType, children, hideFooter, onGetValues, uploadUrl, pollResults, showResults, hideInputsOnResults, sendHiddenSectionsAsEmpty, preview, deleteMode, }: RenderProps): import("react/jsx-runtime").JSX.Element;
