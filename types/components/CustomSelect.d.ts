import React from "react";
interface CustomSelectProps {
    className?: string;
    options: any;
    placeholder?: string;
    errors?: any;
    register?: any;
    setValue?: any;
    name: string;
    label?: string;
    value?: any;
    trigger?: any;
    isMultiple?: boolean;
    isFloatingLabel?: boolean;
    subText?: string;
    labelClass?: string;
    loading?: boolean;
    disabled?: boolean;
}
declare const CustomSelect: React.FC<CustomSelectProps>;
export default CustomSelect;
