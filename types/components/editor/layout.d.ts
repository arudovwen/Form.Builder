import "react-toastify/dist/ReactToastify.css";
export interface BuilderProps {
    onSubmit: (e: any) => void;
    questionData?: any;
    isReadOnly?: boolean;
    config?: any;
    title?: string;
    loading?: boolean;
    backUrl?: string;
}
export default function Layout({ onSubmit, questionData, title, backUrl, loading, }: BuilderProps): import("react/jsx-runtime").JSX.Element;
