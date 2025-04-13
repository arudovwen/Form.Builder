import React from "react";
interface ButtonProps {
    text?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    btnClass?: string;
    icon?: string;
    iconPosition?: "left" | "right";
    iconClass?: string;
    loadingClass?: string;
    link?: string;
    div?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    style?: React.CSSProperties;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
