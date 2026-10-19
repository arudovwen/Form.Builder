import { DeleteMode, BuilderMode, FormSettings } from "../../context/editor-context";
export interface BuilderProps {
    onSubmit?: (data: any, settings?: FormSettings) => void;
    onChange?: (data: any, settings?: FormSettings) => void;
    onLogAction?: (action: string, value: any) => void;
    formData?: any;
    isReadOnly?: boolean;
    config?: any;
    deleteMode?: DeleteMode;
    mode?: BuilderMode;
    title?: string;
    description?: string;
    formSettings?: FormSettings;
    onTitleChange?: (title: string) => void;
    onDescriptionChange?: (description: string) => void;
    onFormSettingsChange?: (settings: FormSettings) => void;
    loading?: boolean;
    goBackUrl?: () => void;
    onPublish?: (data: any, settings?: FormSettings) => void;
    previewLoading?: boolean;
    saveLoading?: boolean;
    publishLoading?: boolean;
    uploadUrl?: string;
    onAddTemplate?: () => void;
    templates?: any[];
    onShowVersion?: () => void;
    formType?: "default" | "poll";
}
export default function Layout(props: BuilderProps): import("react/jsx-runtime").JSX.Element;
