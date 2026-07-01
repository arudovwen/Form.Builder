export interface BuilderProps {
    onSubmit?: (e: any) => void;
    onChange?: (data: any) => void;
    onLogAction?: (action: string, value: any) => void;
    questionData?: any;
    isReadOnly?: boolean;
    config?: any;
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
}
export default function Layout({ onSubmit, onChange, onLogAction, questionData, title, goBackUrl, loading, onPublish, previewLoading, saveLoading, publishLoading, onTitleChange, uploadUrl, onAddTemplate, templates, }: BuilderProps): import("react/jsx-runtime").JSX.Element;
