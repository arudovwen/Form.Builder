export default function CustomSearchSelect({ options, defaultValue, onGetValue, readOnly, name, }: {
    options: any[];
    defaultValue?: any;
    onGetValue: (value: any, name: string) => void;
    readOnly?: boolean;
    name: string;
}): import("react/jsx-runtime").JSX.Element;
