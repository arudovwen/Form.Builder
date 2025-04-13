export interface RenderProps {
    onSubmit?: (e: any) => void;
    answerData?: any;
    isReadOnly?: boolean;
    form_data?: any;
    ignoreValidation?: boolean;
    loading?: boolean;
    config?: any;
}
export default function Viewer({ answerData, form_data, ignoreValidation, onSubmit, isReadOnly, loading, config, }: RenderProps): import("react/jsx-runtime").JSX.Element;
