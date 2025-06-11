import "react-toastify/dist/ReactToastify.css";
export interface BuilderProps {
    onSubmit: (e: any) => void;
    questionData?: any;
    isReadOnly?: boolean;
    config?: any;
    title?: string;
    loading?: boolean;
    goBackUrl?: () => void;
    onPublish: (e: any) => void;
}
export default function Layout({ onSubmit, questionData, title, goBackUrl, loading, onPublish, }: BuilderProps): import("react/jsx-runtime").JSX.Element;
