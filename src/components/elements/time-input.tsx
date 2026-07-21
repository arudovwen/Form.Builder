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
  
  let selectedValue;
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }

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
