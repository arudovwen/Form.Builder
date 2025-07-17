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
    };
};
export default function SignDocument({ element, validationData, }: SignDocumentProps): import("react/jsx-runtime").JSX.Element;
export {};
