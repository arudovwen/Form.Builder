interface FileUploadProps {
    onFileLoaded: (data: Array<{
        base64: string;
        type: string;
        name: string;
    }>) => void;
    disabled?: boolean;
    handleDeleteFile?: () => void;
    multiple?: boolean;
    list: any;
    accept?: any[];
}
export default function FileUpload({ onFileLoaded, disabled, handleDeleteFile, multiple, list, accept, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
export {};
