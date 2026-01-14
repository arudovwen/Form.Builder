import React from "react";
import "react-datepicker/dist/react-datepicker.css";
interface CustomDatePickerProps {
    value?: Date | string | null;
    onGetValue?: (name: string, date: Date | null) => void;
    readOnly?: boolean;
    dateFormat?: string;
    name: string;
    placeholder?: string;
    minDate?: null;
    maxDate?: null;
    showYearDropdown?: boolean;
}
declare const CustomDatePicker: React.FC<CustomDatePickerProps>;
export default CustomDatePicker;
