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
    addElementInPosition: (element: any, sectionId: string, index: any) => void;
    updateElement: (value: any, sectionId: string) => void;
    updateSection: (value: any, sectionId: string) => void;
    setIsDragging: (value: boolean) => void;
    isDragging: boolean;
    uploadUrl: string;
    setUploadUrl: (e: string) => void;
    /**
     * Universal element move:
     *  - canvas  → canvas  (reorder by index)
     *  - grid    → canvas  (eject; targetIndex = insertion point)
     *  - canvas  → grid    (inject into col; targetGridId + targetCol required)
     *  - grid    → grid    (transfer between cells)
     */
    moveElement: (opts: {
        draggedId: string;
        sectionId: string;
        targetIndex?: number;
        targetId?: string;
        targetGridId?: string;
        targetCol?: number;
    }) => void;
}>;
export declare const EditorProvider: React.FC<EditorProviderProps>;
export default EditorContext;
