import { DeleteMode } from "../../context/editor-context";
export interface FormElement {
    id: string;
    isReadOnly?: false;
    isFieldDeleted?: boolean;
    isDeleted?: boolean;
    [key: string]: any;
}
export interface EditorContextType {
    formData: FormElement[];
    setFormData: (data: FormElement[]) => void;
    updateElementPosition: (newData: FormElement[], sectionId: string) => void;
    updateElement: any;
    removeElement: any;
    isDragging: boolean;
    uploadUrl?: string;
    deleteMode?: DeleteMode;
}
declare function ElementCanvas({ elementData, sectionId }: any): import("react/jsx-runtime").JSX.Element;
declare const _default: import("react").MemoExoticComponent<typeof ElementCanvas>;
export default _default;
