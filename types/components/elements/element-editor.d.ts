import React from "react";
interface ElementEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    element: any;
}
declare const ElementEditorModal: React.FC<ElementEditorModalProps>;
export default ElementEditorModal;
