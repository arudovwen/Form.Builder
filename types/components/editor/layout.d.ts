import "react-toastify/dist/ReactToastify.css";
export interface BuilderProps {
    onSubmit: (e: any) => void;
    questionData?: any;
    isReadOnly?: boolean;
    config?: any;
}
export default function Layout({ onSubmit, questionData }: BuilderProps): import("react/jsx-runtime").JSX.Element;
