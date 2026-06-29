export default function MainPage({ questionData, uploadUrl, onAddTemplate, templates, viewMode, }: {
    questionData: any[];
    isReadOnly?: boolean;
    uploadUrl?: string;
    onAddTemplate?: () => void;
    templates?: any[];
    viewMode?: "canvas" | "flow";
}): import("react/jsx-runtime").JSX.Element;
