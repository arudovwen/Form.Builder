import React from "react";
interface EditorProviderProps {
    children: React.ReactNode;
}
declare const EditorContext: React.Context<{
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    handleDragStop: (e: any, elementId: string) => void;
    removeElement: (elementId: string, sectionId: string) => void;
    updateElementPosition: (updatedFormData: any[], sectionId: string) => void;
    addElement: (element: any, sectionId: string) => void;
    updateElement: (value: any, sectionId: string) => void;
    updateSection: (value: any, sectionId: string) => void;
    setIsDragging: (value: boolean) => void;
}>;
export declare const EditorProvider: React.FC<EditorProviderProps>;
export default EditorContext;
