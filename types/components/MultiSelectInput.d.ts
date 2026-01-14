import "./CustomSelect.css";
interface Option {
    id: string;
    label: string;
    value?: any;
}
interface MultiSelectInputProps {
    value?: Option[];
    onChange?: (value: Option[]) => void;
    options: Option[];
}
export default function MultiSelectInput({ value, onChange, options, }: MultiSelectInputProps): import("react/jsx-runtime").JSX.Element;
export {};
