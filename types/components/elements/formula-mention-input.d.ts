interface MentionField {
    id: string;
    display: string;
}
interface FormulaMentionInputProps {
    value: string;
    onChange: (value: string) => void;
    fields: MentionField[];
    placeholder?: string;
}
export default function FormulaMentionInput({ value, onChange, fields, placeholder, }: FormulaMentionInputProps): import("react/jsx-runtime").JSX.Element;
export {};
