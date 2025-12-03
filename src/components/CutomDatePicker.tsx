import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import CalendarSvg from "../assets/svgs/calendar";

const CustomDatePicker = ({
  defaultValue,
  onGetValue,
  readOnly,
  dateFormat,
  name,
}: any) => {
  const [startDate, setStartDate] = useState(defaultValue || null);
  useEffect(() => {
    if (onGetValue) {
      onGetValue(name, startDate);
    }
  }, [startDate, name]);

  return (
    <DatePicker
      showIcon
      icon={<CalendarSvg className="react-datepicker__calendar-icon " />}
      showPopperArrow={false}
      dateFormat={dateFormat}
      disabled={readOnly}
      selected={startDate}
      onChange={(date: Date | null) => setStartDate(date ?? new Date())}
      className={"field-control"}
      portalId="root-portal"
      placeholderText="Select date"
    />
  );
};

export default CustomDatePicker;
