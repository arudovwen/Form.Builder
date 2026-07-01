interface Option {
    label: string;
    value: string;
}
interface CustomSearchSelectProps {
    options?: Option[];
    apiUrl?: string;
    value?: string;
    defaultValue?: string;
    onGetValue: (name: string, option: Option | null) => void;
    readOnly?: boolean;
    name: string;
    customClass?: string;
}
export default function CustomSearchSelect({ options, apiUrl, value, defaultValue, onGetValue, readOnly, name, customClass }: CustomSearchSelectProps): import("react/jsx-runtime").JSX.Element;
export {};
