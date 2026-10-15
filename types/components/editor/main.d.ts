export default function MainPage({ initialFormData, uploadUrl, onAddTemplate, templates, viewMode, }: {
    initialFormData: any[];
    isReadOnly?: boolean;
    uploadUrl?: string;
    onAddTemplate?: () => void;
    templates?: any[];
    viewMode?: "canvas" | "flow";
}): import("react/jsx-runtime").JSX.Element;
