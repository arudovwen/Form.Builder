import React from "react";
interface CustomSelectProps {
    className?: string;
    options: any[];
    placeholder?: string;
    errors?: {
        message?: string;
    };
    register?: any;
    setValue?: (name: string, value: any) => void;
    name: string;
    label?: string;
    value?: any;
    trigger?: (name: string) => void;
    isMultiple?: boolean;
    isFloatingLabel?: boolean;
    subText?: string;
    labelClass?: string;
    loading?: boolean;
    disabled?: boolean;
}
declare const CustomSelect: React.FC<CustomSelectProps>;
export default CustomSelect;
