interface PhoneInputProps {
    label?: string;
    placeholder?: string;
    classLabel?: string;
    isRequired?: boolean;
    isOptional?: boolean;
    name?: string;
    value?: string;
    error?: string;
    disabled?: boolean;
    readOnly?: boolean;
    horizontal?: boolean;
    description?: string;
    validate?: string;
    onChange?: (val: string) => void;
    onError?: (err: string | null) => void;
}
export default function PhoneInput({ label, placeholder, classLabel, isRequired, isOptional, name, value, error, disabled, readOnly, horizontal, description, onChange, onError, }: PhoneInputProps): import("react/jsx-runtime").JSX.Element;
export {};
