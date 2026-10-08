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
  const selectedValue =
    (watch ? watch(element.id) : undefined) ??
    (validationData?.getValues ? validationData.getValues(element.id) : undefined) ??
    element?.value;

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);
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
