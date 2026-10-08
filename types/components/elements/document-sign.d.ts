type SignDocumentProps = {
    element: {
        id: string;
        placeholder?: string;
        inputType?: string;
        customClass?: string;
        validationUrl: string;
        documentObj: string;
        signatureLink?: string;
    };
    validationData: {
        register?: (id: string) => any;
        isReadOnly?: boolean;
        setValue?: (id: string, value: any) => void;
    };
};
export default function SignDocument({ element, validationData, }: SignDocumentProps): import("react/jsx-runtime").JSX.Element;
export {};
