import React from "react";
declare const TemplateSelectorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    templates: any[];
    onSelect: (template: any) => void;
}>;
export default TemplateSelectorModal;
