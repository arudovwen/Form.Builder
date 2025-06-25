import React from "react";
type CascadeDropdownProps = {
    element: any;
    validationData: {
        register?: () => any;
        trigger?: any;
        setValue?: any;
        watch?: () => Record<string, any>;
        isReadOnly?: boolean;
    };
};
declare const CascadeDropdown: React.FC<CascadeDropdownProps>;
export default CascadeDropdown;
