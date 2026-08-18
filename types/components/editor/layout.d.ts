import { DeleteMode } from "../../context/editor-context";
export interface BuilderProps {
    onSubmit?: (e: any) => void;
    onChange?: (data: any) => void;
    onLogAction?: (action: string, value: any) => void;
    questionData?: any;
    isReadOnly?: boolean;
    config?: any;
    deleteMode?: DeleteMode;
    title?: string;
    loading?: boolean;
    goBackUrl?: () => void;
    onPublish?: (e: any) => void;
    previewLoading?: boolean;
    saveLoading?: boolean;
    publishLoading?: boolean;
    onTitleChange?: (string: any) => void;
    uploadUrl?: string;
    onAddTemplate?: () => void;
    templates?: any[];
    onShowVersion?: () => void;
    formType?: "default" | "poll";
}
export default function Layout({ onSubmit, onChange, onLogAction, questionData, deleteMode, config, title, goBackUrl, loading, onPublish, previewLoading, saveLoading, publishLoading, onTitleChange, uploadUrl, onAddTemplate, templates, onShowVersion, formType, }: BuilderProps): import("react/jsx-runtime").JSX.Element;
