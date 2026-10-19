import React from "react";
import "./preview.css";
export interface FormPreviewProps {
    activeMode?: "multi" | "single" | "conversational";
    onModeChange?: (mode: "multi" | "single" | "conversational") => void;
}
declare const FormPreview: React.FC<FormPreviewProps>;
export default FormPreview;
