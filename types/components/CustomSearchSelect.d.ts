interface Option {
    label: string;
    value: string;
}
interface CustomSearchSelectProps {
    options?: Option[];
    apiUrl?: string;
    value?: string;
    defaultValue?: string;
    selectedLabel?: string;
    onGetValue: (name: string, option: Option | null) => void;
    readOnly?: boolean;
    name: string;
    customClass?: string;
    allowCustom?: boolean;
}
export default function CustomSearchSelect({ options, apiUrl, value, defaultValue, selectedLabel, onGetValue, readOnly, name, customClass, allowCustom, }: CustomSearchSelectProps): import("react/jsx-runtime").JSX.Element;
export {};
