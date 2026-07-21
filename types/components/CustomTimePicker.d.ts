import React from "react";
interface CustomTimePickerProps {
    value?: string | null;
    onGetValue?: (name: string, time: string | null) => void;
    readOnly?: boolean;
    name: string;
    placeholder?: string;
    is24Hour?: boolean;
}
declare const CustomTimePicker: React.FC<CustomTimePickerProps>;
export default CustomTimePicker;
