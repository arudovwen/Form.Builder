import React from "react";
type DropdownOption = {
    key?: string;
    value: string;
    label: string;
};
type CascadeDropdownProps = {
    element: {
        id: string;
        customClass?: string;
        name?: string;
        options?: DropdownOption[];
        options1?: DropdownOption[];
        childLabel?: string;
    };
    validationData: {
        register?: any;
        trigger?: (name: string) => Promise<boolean>;
        setValue?: (name: string, value: string) => void;
        watch?: (name?: string) => any;
        isReadOnly?: boolean;
    };
};
declare const CascadeDropdown: React.FC<CascadeDropdownProps>;
export default CascadeDropdown;
