interface Option {
    label: string;
    value: string;
}
interface CustomSearchSelectProps {
    options: Option[];
    value?: string;
    defaultValue?: string;
    onGetValue: (name: string, option: Option | null) => void;
    readOnly?: boolean;
    name: string;
}
export default function CustomSearchSelect({ options, value, defaultValue, onGetValue, readOnly, name, }: CustomSearchSelectProps): import("react/jsx-runtime").JSX.Element;
export {};
