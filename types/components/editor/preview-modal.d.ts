import React from "react";
import "./preview.css";
interface PreviewModalModalProps {
    isOpen: boolean;
    onClose: () => void;
    element: any;
}
declare const PreviewModalModal: React.FC<PreviewModalModalProps>;
export default PreviewModalModal;
