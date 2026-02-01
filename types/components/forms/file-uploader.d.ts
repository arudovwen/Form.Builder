type FileItem = {
    base64: string;
    type: string;
    name: string;
};
interface FileUploadProps {
    onFileLoaded: (data: FileItem[] | null) => void;
    disabled?: boolean;
    handleDeleteFile?: () => void;
    multiple?: boolean;
    list?: FileItem[] | null;
    accept?: {
        value: string;
        label: string;
    }[];
}
export default function FileUpload({ onFileLoaded, disabled, handleDeleteFile, multiple, list, accept, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
export {};
