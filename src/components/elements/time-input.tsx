import CustomTimePicker from "../CustomTimePicker";
import { useEffect } from "react";

export default function TimeInput({
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
    <CustomTimePicker
      name={element.id}
      value={selectedValue}
      onGetValue={setValue}
      readOnly={validationData?.isReadOnly}
      placeholder={element?.placeholder || "Select time"}
      is24Hour={element?.is24Hour || false}
    />
  );
}
