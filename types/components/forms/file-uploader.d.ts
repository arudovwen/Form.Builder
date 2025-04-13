interface FileUploadProps {
    onFileLoaded: (data: {
        base64: string;
        type: string;
        name: string;
    }) => void;
    disabled?: boolean;
}
export default function FileUpload({ onFileLoaded, disabled, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
export {};
