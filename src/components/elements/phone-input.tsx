import { useEffect } from "react";
import PhoneInput from "../PhoneInput";

export default function PhoneNumber({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const {
    register = () => ({}),
    trigger,
    setValue,
    watch,
    isReadOnly,
  } = validationData || {};
  let selectedValue = '+234-4141452353';

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }
  return (
    <PhoneInput
      placeholder={element.placeholder}
      label={""}
      name={element.id}
      value={selectedValue}
      readOnly={isReadOnly}
      disabled={isReadOnly}
      onChange={(data) => {
        if(!data) return
 
        setValue?.(element.id, data);
        trigger?.(element.id);
      }}
    />
  );
}
