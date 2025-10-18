export default function TopBar({ title, goBackUrl, onSubmit, onPublish, previewLoading, saveLoading, publishLoading, onTitleChange, }: {
    title: string;
    goBackUrl: () => void;
    onSubmit?: (e: any) => void;
    onPublish?: (e: any) => void;
    previewLoading?: boolean;
    saveLoading?: boolean;
    publishLoading?: boolean;
    onTitleChange?: (newTitle: string) => void;
}): import("react/jsx-runtime").JSX.Element;
