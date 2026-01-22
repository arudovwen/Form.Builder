interface FileUploadProps {
    onFileLoaded: (data: {
        base64: string;
        type: string;
        name: string;
    }) => void;
    disabled?: boolean;
    handleDeleteFile?: () => void;
}
export default function FileUpload({ onFileLoaded, disabled, handleDeleteFile, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
export {};
