import clsx from "clsx";
import CustomDatePicker from "../CutomDatePicker";
import { useEffect } from "react";

export default function DateInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const {
    register = () => ({}),

    setValue,
    watch,
  } = validationData || {};
  let selectedValue;
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }

  useEffect(() => {
    register(element.id);
  }, [element.id]);
  return (
    <CustomDatePicker
      name={element.id}
      value={selectedValue}
      onGetValue={setValue}
      readOnly={validationData?.isReadOnly}
      dateFormat={element?.dateFormat || "dd/MM/yyyy"}
      minDate={element?.minDate}
      maxDate={element?.maxDate}
      showYearDropdown={element?.allowYearPicker}
    />
  );
}
