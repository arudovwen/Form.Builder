export default function TopBar({ title, goBackUrl, onSubmit, onPublish, }: {
    title: string;
    goBackUrl: () => void;
    onSubmit?: (e: any) => void;
    onPublish?: (e: any) => void;
}): import("react/jsx-runtime").JSX.Element;
