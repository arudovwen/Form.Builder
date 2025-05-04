export interface FormElement {
    id: string;
    isReadOnly?: false;
    [key: string]: any;
}
export interface EditorContextType {
    formData: FormElement[];
    setFormData: (data: FormElement[]) => void;
    updateElementPosition: (newData: FormElement[], sectionId: string) => void;
    updateElement: any;
    removeElement: any;
    isDragging: boolean;
}
declare function ElementCanvas({ elementData, sectionId }: any): import("react/jsx-runtime").JSX.Element;
declare const _default: import("react").MemoExoticComponent<typeof ElementCanvas>;
export default _default;
