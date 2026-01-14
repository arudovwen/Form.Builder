import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import CalendarSvg from "../assets/svgs/calendar";

interface CustomDatePickerProps {
  value?: Date | string | null;
  onGetValue?: (name: string, date: Date | null) => void;
  readOnly?: boolean;
  dateFormat?: string;
  name: string;
  placeholder?: string;
  minDate?: null;
  maxDate?: null;
  showYearDropdown?: boolean
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value = null,
  onGetValue,
  readOnly = false,
  dateFormat='dd/MM/yyyy',
  name,
  placeholder = "Select date",
  minDate,
  maxDate,
  showYearDropdown
}) => {
  const initialDate = value ? new Date(value) : null;

  const [startDate, setStartDate] = useState<Date | null>(initialDate);

  // 🔥 Watch for external value changes
  useEffect(() => {
    const newDate = value ? new Date(value) : null;

    // Only update if the value actually changed
    if (
      (newDate && startDate && newDate.getTime() !== startDate.getTime()) ||
      (!newDate && startDate) ||
      (newDate && !startDate)
    ) {
      setStartDate(newDate);
    }
  }, [value]);

  // 🔥 Notify parent when internal date changes
  useEffect(() => {
    if (onGetValue) {
      onGetValue(name, startDate);
    }
  }, [startDate, onGetValue, name]);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  return (
    <>
      <DatePicker
        showIcon
        icon={<CalendarSvg className="react-datepicker__calendar-icon" />}
        showPopperArrow={false}
        dateFormat={dateFormat}
        disabled={readOnly}
        selected={startDate}
        onChange={handleDateChange}
        className="field-control"
        portalId="root-portal"
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        showYearDropdown={showYearDropdown}
        dropdownMode="select"
      />
    </>
  );
};

export default CustomDatePicker;
