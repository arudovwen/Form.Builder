import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
  defaultValue,
  onGetValue,
  readOnly,
  dateFormat,
  name,
}: any) => {
  const [startDate, setStartDate] = useState(defaultValue || new Date());
  useEffect(() => {
    if (onGetValue) {
      onGetValue(name, startDate);
    }
  }, [startDate, name]);

  return (
    <DatePicker
      dateFormat={dateFormat}
      disabled={readOnly}
      showIcon
      selected={startDate}
      onChange={(date: Date | null) => setStartDate(date ?? new Date())}
      className={"field-control"}
    />
  );
};

export default CustomDatePicker;
